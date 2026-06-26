import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const fw = process.env.NEXT_PUBLIC_FRAMEWORK_NAME ?? "My Framework";
const before = process.env.NEXT_PUBLIC_CLIENT_BEFORE ?? "where you are";
const after = process.env.NEXT_PUBLIC_CLIENT_AFTER ?? "where you want to be";

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
