"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const FW = typeof window !== "undefined"
  ? process.env.NEXT_PUBLIC_FRAMEWORK_NAME ?? "My Framework"
  : process.env.NEXT_PUBLIC_FRAMEWORK_NAME ?? "My Framework";

const CLIENT_AFTER = process.env.NEXT_PUBLIC_CLIENT_AFTER ?? "where you want to be";

const STEPS = [
  {
    id: "welcome",
    title: `Welcome to ${FW}`,
    description: `You've taken the first step toward becoming ${CLIENT_AFTER}. Let's get you set up in under 3 minutes.`,
    fields: [] as Field[],
  },
  {
    id: "profile",
    title: "Tell us about yourself",
    description: "This helps us personalise your experience inside the framework.",
    fields: [
      { key: "full_name", label: "Full Name", type: "text" as const, placeholder: "Your name" },
      { key: "business", label: "Business / Project", type: "text" as const, placeholder: "What are you building?" },
      {
        key: "goal",
        label: "Primary Goal",
        type: "select" as const,
        options: [
          "Escape the 9–5",
          "Build recurring revenue",
          "Launch my framework",
          "Scale an existing business",
          "Other",
        ],
      },
    ],
  },
  {
    id: "baseline",
    title: "Where are you right now?",
    description: "Honest baseline sets you up for the biggest transformation.",
    fields: [
      {
        key: "current_revenue",
        label: "Current Monthly Revenue",
        type: "select" as const,
        options: ["$0 — pre-revenue", "$1–$2,000", "$2,000–$10,000", "$10,000–$50,000", "$50,000+"],
      },
      {
        key: "biggest_block",
        label: "Biggest Block Right Now",
        type: "textarea" as const,
        placeholder: "What's the one thing stopping you?",
      },
    ],
  },
  {
    id: "done",
    title: "You're in.",
    description: "Your account is set up. Head to your dashboard to begin Stage 1.",
    fields: [] as Field[],
  },
];

interface Field {
  key: string;
  label: string;
  type: "text" | "select" | "textarea";
  placeholder?: string;
  options?: string[];
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function advance() {
    if (step === STEPS.length - 2) {
      setSaving(true);
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }).catch(() => {});
      setSaving(false);
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  const current = STEPS[step];
  const progress = Math.round((step / (STEPS.length - 1)) * 100);
  const isLast = step === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F0F0] flex flex-col items-center justify-center px-6 py-16">
      {/* Progress */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between text-[10px] text-[#6B7280] mb-2">
          <span>Step {step + 1} of {STEPS.length}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 bg-[#1E1E2E] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#7C3AED] to-[#00E5A0] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-[#12121A] border border-[#1E1E2E] rounded-2xl p-8">
        {isLast ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#00E5A0]/10 border border-[#00E5A0]/30 flex items-center justify-center text-3xl mx-auto mb-6">
              👑
            </div>
            <h2 className="text-2xl font-black text-[#00E5A0] mb-3">{current.title}</h2>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-8">{current.description}</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="block w-full py-3 bg-[#7C3AED] text-white font-bold rounded-xl hover:brightness-110 transition-all"
            >
              Go to My Dashboard →
            </button>
          </div>
        ) : (
          <>
            <p className="text-[10px] font-mono tracking-[0.2em] text-[#C9A84C]/60 uppercase mb-2">
              ONBOARDING
            </p>
            <h2 className="text-xl font-black mb-2">{current.title}</h2>
            <p className="text-sm text-[#6B7280] leading-relaxed mb-7">{current.description}</p>

            {current.fields.length > 0 && (
              <div className="space-y-5 mb-7">
                {current.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
                      {field.label}
                    </label>
                    {field.type === "text" && (
                      <input
                        type="text"
                        value={form[field.key] ?? ""}
                        onChange={(e) => update(field.key, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    )}
                    {field.type === "select" && (
                      <select
                        value={form[field.key] ?? ""}
                        onChange={(e) => update(field.key, e.target.value)}
                      >
                        <option value="">Select an option…</option>
                        {field.options?.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    )}
                    {field.type === "textarea" && (
                      <textarea
                        value={form[field.key] ?? ""}
                        onChange={(e) => update(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={3}
                        style={{ resize: "none" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={advance}
              disabled={saving}
              className="w-full py-3 bg-[#7C3AED] text-white font-bold rounded-xl hover:brightness-110 transition-all disabled:opacity-50"
            >
              {saving ? "Saving…" : step === STEPS.length - 2 ? "Complete Setup →" : "Continue →"}
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      <div className="flex gap-2 mt-6">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i === step
                ? "w-6 h-2 bg-[#7C3AED]"
                : i < step
                ? "w-2 h-2 bg-[#00E5A0]"
                : "w-2 h-2 bg-[#1E1E2E]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
