import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function db() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );
}

const TABLE = () => process.env.FRAMEWORK_TABLE_PREFIX ?? "forge_default";

async function getUserId(supabase: ReturnType<typeof createClient>, clerkId: string, table: string): Promise<string | null> {
  const { data } = await supabase
    .from(`${table}_users`)
    .select("id")
    .eq("clerk_id", clerkId)
    .single();
  return data?.id ?? null;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = db();
  const table = TABLE();
  const uid = await getUserId(supabase, userId, table);
  if (!uid) return NextResponse.json({ progress: [] });

  const { data } = await supabase
    .from(`${table}_progress`)
    .select("stage, score, completed_at")
    .eq("user_id", uid)
    .order("completed_at", { ascending: true });

  return NextResponse.json({ progress: data ?? [] });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { stage, score } = await req.json();
  if (!stage) return NextResponse.json({ error: "stage required" }, { status: 400 });

  const supabase = db();
  const table = TABLE();
  let uid = await getUserId(supabase, userId, table);

  if (!uid) {
    const { data: newUser } = await supabase
      .from(`${table}_users`)
      .insert({ clerk_id: userId, tier: "free" })
      .select("id")
      .single();
    uid = newUser?.id ?? null;
  }

  if (!uid) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { data } = await supabase
    .from(`${table}_progress`)
    .upsert(
      { user_id: uid, stage, score: score ?? 100, completed_at: new Date().toISOString() },
      { onConflict: "user_id,stage" }
    )
    .select("stage, score, completed_at")
    .single();

  return NextResponse.json({ progress: data });
}
