"use client";

import { useEffect, useState } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";

interface Stage {
  name: string;
  description?: string;
}

interface Progress {
  stage: string;
  completed_at: string | null;
  score: number;
}

function parseStages(): Stage[] {
  try {
    const raw = process.env.NEXT_PUBLIC_STAGES ?? "[]";
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {}
  return [
    { name: "Stage 1", description: "Build your foundation" },
    { name: "Stage 2", description: "Take consistent action" },
    { name: "Stage 3", description: "Achieve your breakthrough" },
  ];
}

const STAGES = parseStages();
const FW = process.env.NEXT_PUBLIC_FRAMEWORK_NAME ?? "My Framework";

export default function DashboardPage() {
  const { user } = useUser();
  const [progress, setProgress] = useState<Progress[]>([]);
  const [marking, setMarking] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/progress")
      .then((r) => r.json())
      .then((d) => setProgress(d.progress ?? []))
      .catch(() => {});
  }, []);

  async function markComplete(stageName: string) {
    setMarking(stageName);
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: stageName, score: 100 }),
    }).catch(() => null);
    if (res?.ok) {
      const data = await res.json();
      setProgress((prev) => {
        const next = prev.filter((p) => p.stage !== stageName);
        return [...next, data.progress];
      });
    }
    setMarking(null);
  }

  const completedNames = new Set(
    progress.filter((p) => p.completed_at).map((p) => p.stage)
  );
  const completedCount = completedNames.size;
  const completionPct = STAGES.length > 0
    ? Math.round((completedCount / STAGES.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F0F0]">
      {/* Header */}
      <header className="border-b border-[#1E1E2E] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-[9px] font-mono tracking-[0.25em] text-[#C9A84C]/60 uppercase mb-0.5">
              {FW}
            </p>
            <h1 className="text-lg font-black">
              Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-[#6B7280]">Completion</p>
              <p className="text-xl font-black text-[#00E5A0]">{completionPct}%</p>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Progress bar */}
        <div className="mb-2 flex justify-between text-[10px] text-[#6B7280]">
          <span>{completedCount} of {STAGES.length} stages complete</span>
          <span>{completionPct}%</span>
        </div>
        <div className="h-2 bg-[#1E1E2E] rounded-full overflow-hidden mb-10">
          <div
            className="h-full bg-gradient-to-r from-[#7C3AED] to-[#00E5A0] rounded-full transition-all duration-700"
            style={{ width: `${completionPct}%` }}
          />
        </div>

        {/* Stage grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STAGES.map((stage, i) => {
            const isComplete = completedNames.has(stage.name);
            const prevComplete = i === 0 || completedNames.has(STAGES[i - 1]?.name ?? "");
            const isLocked = !isComplete && !prevComplete;
            const isActive = !isComplete && prevComplete;

            return (
              <div
                key={i}
                className={`p-5 rounded-2xl border transition-all ${
                  isComplete
                    ? "border-[#00E5A0]/30 bg-[#00E5A0]/5"
                    : isActive
                    ? "border-[#7C3AED]/40 bg-[#7C3AED]/5"
                    : "border-[#1E1E2E] bg-[#12121A] opacity-50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1E1E2E] flex items-center justify-center text-[#6B7280] font-black text-xs">
                    {i + 1}
                  </div>
                  {isComplete && (
                    <span className="text-[9px] font-bold text-[#00E5A0] bg-[#00E5A0]/10 border border-[#00E5A0]/30 px-2 py-0.5 rounded-full">
                      DONE ✓
                    </span>
                  )}
                  {isActive && (
                    <span className="text-[9px] font-bold text-[#7C3AED] bg-[#7C3AED]/10 border border-[#7C3AED]/30 px-2 py-0.5 rounded-full">
                      ACTIVE
                    </span>
                  )}
                  {isLocked && (
                    <span className="text-[9px] font-bold text-[#6B7280] bg-[#1E1E2E] px-2 py-0.5 rounded-full">
                      LOCKED
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-[#F0F0F0] mb-1">{stage.name}</h3>
                {stage.description && (
                  <p className="text-xs text-[#6B7280] mb-3">{stage.description}</p>
                )}
                {isActive && (
                  <button
                    onClick={() => markComplete(stage.name)}
                    disabled={marking === stage.name}
                    className="w-full mt-2 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-bold hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {marking === stage.name ? "Saving…" : "Mark Complete ✓"}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
          {[
            { label: "Stages Done", value: `${completedCount}/${STAGES.length}` },
            { label: "Completion", value: `${completionPct}%` },
            { label: "Next Stage", value: STAGES[completedCount]?.name?.split(" ")[0] ?? "🏆" },
            { label: "Status", value: completionPct === 100 ? "Sovereign" : "In Progress" },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl border border-[#1E1E2E] bg-[#12121A] text-center">
              <p className="text-lg font-black text-[#F0F0F0]">{s.value}</p>
              <p className="text-[10px] text-[#6B7280] mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {completionPct === 100 && (
          <div className="mt-8 p-6 rounded-2xl border border-[#00E5A0]/30 bg-[#00E5A0]/5 text-center">
            <p className="text-2xl mb-2">👑</p>
            <h3 className="font-black text-[#00E5A0] mb-1">Framework Complete!</h3>
            <p className="text-sm text-[#6B7280]">
              You've completed all stages of {FW}. Congratulations on your transformation.
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/pricing" className="text-xs text-[#6B7280] hover:text-[#7C3AED] transition-colors">
            Upgrade your access →
          </Link>
        </div>
      </main>
    </div>
  );
}
