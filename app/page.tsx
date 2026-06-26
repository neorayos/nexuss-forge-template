export const dynamic = "force-dynamic";

import Link from "next/link";

function parseStages(raw: string | undefined): Array<{ name: string; description?: string }> {
  try { return JSON.parse(raw ?? "[]"); } catch { return []; }
}

export default function LandingPage() {
  const fw     = process.env.FRAMEWORK_NAME     ?? "My Framework";
  const before = process.env.FRAMEWORK_BEFORE   ?? "where you are now";
  const after  = process.env.FRAMEWORK_AFTER    ?? "where you want to be";
  const stages = parseStages(process.env.FRAMEWORK_STAGES);

  const displayStages = stages.length > 0
    ? stages.slice(0, 6)
    : [
        { name: "Discover", description: "Uncover your core framework" },
        { name: "Build",    description: "Structure your methodology" },
        { name: "Launch",   description: "Go live and attract clients" },
      ];

  return (
    <main className="min-h-screen bg-[#0A0A0F] text-[#F0F0F0]">
      {/* Nav */}
      <nav className="border-b border-[#1E1E2E] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <p className="text-[10px] font-mono tracking-[0.25em] text-[#C9A84C]/70 uppercase">{fw}</p>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm text-[#6B7280] hover:text-[#F0F0F0] transition-colors">
              Pricing
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 bg-[#7C3AED] text-white text-sm font-semibold rounded-lg hover:brightness-110 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <p className="text-[10px] font-mono tracking-[0.3em] text-[#C9A84C]/70 uppercase mb-6">
          Built with NEXUSS FORGE
        </p>
        <h1 className="text-5xl sm:text-6xl font-black leading-tight mb-8">
          From{" "}
          <span className="text-[#EF4444]">{before}</span>
          <br />
          to{" "}
          <span className="text-[#00E5A0]">{after}</span>.
        </h1>
        <p className="text-lg text-[#6B7280] max-w-xl mx-auto leading-relaxed mb-12">
          {fw} is a proven framework that takes you through a step-by-step
          system designed to transform your results for good.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#7C3AED] text-white font-bold rounded-xl hover:brightness-110 transition-all text-base"
          >
            Start Your Journey →
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#1E1E2E] text-[#6B7280] font-semibold rounded-xl hover:border-[#7C3AED]/30 hover:text-[#7C3AED] transition-all text-base"
          >
            View Pricing
          </Link>
        </div>
      </section>

      {/* Framework stages */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-[#1E1E2E]">
        <div className="text-center mb-12">
          <p className="text-[9px] font-mono tracking-[0.2em] text-[#6B7280] uppercase mb-3">The Framework</p>
          <h2 className="text-2xl font-black">Your path to {after}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayStages.map((stage, i) => (
            <div key={i} className="p-6 rounded-2xl border border-[#1E1E2E] bg-[#12121A]">
              <div className="w-9 h-9 rounded-lg bg-[#7C3AED]/10 border border-[#7C3AED]/25 flex items-center justify-center text-[#7C3AED] font-black text-sm mb-4">
                {i + 1}
              </div>
              <h3 className="font-bold text-[#F0F0F0] mb-1">{stage.name}</h3>
              {stage.description && (
                <p className="text-sm text-[#6B7280]">{stage.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-black mb-4">Ready to become {after}?</h2>
        <p className="text-[#6B7280] mb-8">Join hundreds of people who have already transformed their results.</p>
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#7C3AED] text-white font-bold rounded-xl hover:brightness-110 transition-all"
        >
          Get Started Today →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E1E2E] px-6 py-8 text-center">
        <p className="text-[10px] text-[#6B7280]">
          {fw} · Powered by{" "}
          <span className="text-[#C9A84C]/70">NEXUSS FORGE</span>
        </p>
      </footer>
    </main>
  );
}
