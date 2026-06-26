import { SignUp } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

const FW = process.env.FRAMEWORK_NAME ?? "My Framework";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center px-6 py-16">
      <div className="mb-8 text-center">
        <p className="text-[10px] font-mono tracking-[0.3em] text-[#C9A84C]/60 uppercase mb-2">
          {FW}
        </p>
        <p className="text-sm text-[#6B7280]">Create your account to get started</p>
      </div>
      <SignUp
        appearance={{
          variables: {
            colorBackground: "#12121A",
            colorText: "#F0F0F0",
            colorTextSecondary: "#6B7280",
            colorPrimary: "#7C3AED",
            colorInputBackground: "#0A0A0F",
            colorInputText: "#F0F0F0",
            colorInputPlaceholder: "#4B5563",
            borderRadius: "12px",
          },
          elements: {
            card: "shadow-2xl border border-[#1E1E2E]",
            dividerLine: "bg-[#1E1E2E]",
            dividerText: "text-[#4B5563]",
            formButtonPrimary: "bg-[#7C3AED] hover:brightness-110 transition-all",
            footerActionLink: "text-[#7C3AED]",
            formFieldLabel: "text-[#9CA3AF]",
          },
        }}
      />
    </div>
  );
}
