import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const TABLE = process.env.NEXT_PUBLIC_TABLE_PREFIX ?? "forge_default";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";

  const { error: upsertErr } = await supabase
    .from(`${TABLE}_users`)
    .upsert(
      { clerk_id: userId, email, tier: "free" },
      { onConflict: "clerk_id" }
    );

  if (upsertErr) {
    console.error("[ONBOARDING] user upsert:", upsertErr.message);
  }

  const { data: user } = await supabase
    .from(`${TABLE}_users`)
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (user?.id) {
    await supabase.from(`${TABLE}_sessions`).insert({
      user_id: user.id,
      data: { ...body, completed_at: new Date().toISOString() },
    });
  }

  return NextResponse.json({ ok: true });
}
