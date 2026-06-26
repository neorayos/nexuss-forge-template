import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function db() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );
}

const TABLE = () => process.env.FRAMEWORK_TABLE_PREFIX ?? "forge_default";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";
  const supabase = db();
  const table = TABLE();

  const { error: upsertErr } = await supabase
    .from(`${table}_users`)
    .upsert(
      { clerk_id: userId, email, tier: "free" },
      { onConflict: "clerk_id" }
    );

  if (upsertErr) {
    console.error("[ONBOARDING] user upsert:", upsertErr.message);
  }

  const { data: user } = await supabase
    .from(`${table}_users`)
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (user?.id) {
    await supabase.from(`${table}_sessions`).insert({
      user_id: user.id,
      data: { ...body, completed_at: new Date().toISOString() },
    });
  }

  return NextResponse.json({ ok: true });
}
