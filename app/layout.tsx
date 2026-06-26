import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

// Prevent static pre-rendering — ClerkProvider validates the publishable key
// during SSR and will throw if env vars aren't baked in at build time.
// force-dynamic ensures all pages render at request time when env vars are live.
export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"] });

const fw = process.env.FRAMEWORK_NAME   ?? "My Framework";
const before = process.env.FRAMEWORK_BEFORE ?? "where you are";
const after  = process.env.FRAMEWORK_AFTER  ?? "where you want to be";

export const metadata: Metadata = {
  title: fw,
  description: `From ${before} to ${after}.`,
  openGraph: {
    title: fw,
    description: `From ${before} to ${after}.`,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
