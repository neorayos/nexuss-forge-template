export const dynamic = "force-dynamic";

import Link from "next/link";

interface Tier {
  name: string;
  price: number | string;
  period?: string;
  features?: string[];
  cta?: string;
}

function parseTiers(): Tier[] {
  try {
    const raw = process.env.FRAMEWORK_VALUE_LADDER ?? "[]";
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {}
  return [
    { name: "Starter",   price: 0,   features: ["Core framework access", "Community access"] },
    { name: "Builder",   price: 97,  period: "mo", features: ["Full methodology", "Live coaching calls", "Private community"] },
    { name: "Sovereign", price: 297, period: "mo", features: ["Everything in Builder", "1:1 sessions", "Done-with-you builds"] },
  ];
}

const FW    = process.env.FRAMEWORK_NAME ?? "My Framework";
const TIERS = parseTiers();

export default function PricingPage() {
  const midIdx = Math.floor(TIERS.length / 2);

  return (
    <main className="min-h-screen bg-[#0A0A0F] text-[#F0F0F0] px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[9px] font-mono tracking-[0.25em] text-[#C9A84C]/60 uppercase mb-4">
            Invest in Your Sovereignty
          </p>
          <h1 className="text-3xl sm:text-4xl font-black mb-4">{FW} Pricing</h1>
          <p className="text-[#6B7280] max-w-md mx-auto text-sm">
            Choose the level of support that matches where you are right now.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TIERS.map((tier, i) => {
            const isHighlighted = i === midIdx;
            const isFree = tier.price === 0 || tier.price === "0" || tier.price === "free" || tier.price === "Free";
            const priceDisplay = isFree
              ? "Free"
              : typeof tier.price === "number"
              ? `$${tier.price}`
              : tier.price;

            return (
              <div
                key={i}
                className={`p-6 rounded-2xl border flex flex-col ${
                  isHighlighted
                    ? "border-[#7C3AED]/40 bg-[#7C3AED]/5"
                    : "border-[#1E1E2E] bg-[#12121A]"
                }`}
              >
                {isHighlighted && (
                  <p className="text-[9px] font-bold text-[#7C3AED] tracking-widest uppercase mb-3">
                    Most Popular
                  </p>
                )}
                <p className="text-[9px] font-mono tracking-[0.2em] text-[#6B7280] uppercase mb-2">
                  {tier.name}
                </p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-3xl font-black ${isFree ? "text-[#00E5A0]" : "text-[#F0F0F0]"}`}>
                    {priceDisplay}
                  </span>
                  {!isFree && tier.period && (
                    <span className="text-[#6B7280] text-sm">/{tier.period}</span>
                  )}
                </div>

                {tier.features && tier.features.length > 0 && (
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {tier.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-[#F0F0F0]/80">
                        <span className="text-[#00E5A0] mt-0.5 flex-shrink-0">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                <Link
                  href="/sign-up"
                  className={`block w-full py-3 rounded-xl text-center font-bold transition-all text-sm mt-auto ${
                    isHighlighted
                      ? "bg-[#7C3AED] text-white hover:brightness-110"
                      : "border border-[#1E1E2E] text-[#6B7280] hover:border-[#7C3AED]/30 hover:text-[#7C3AED]"
                  }`}
                >
                  {tier.cta ?? (isFree ? "Get Started Free" : `Join ${tier.name}`)}
                </Link>
              </div>
            );
          })}
        </div>

        <p className="text-center text-[10px] text-[#6B7280] mt-10">
          All plans include access to {FW} · Powered by{" "}
          <span className="text-[#C9A84C]/70">NEXUSS FORGE</span>
        </p>
      </div>
    </main>
  );
}
