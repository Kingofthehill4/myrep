import type { Metadata } from "next";
import "./globals.css";
import { StudioShell } from "@/components/StudioShell";

export const metadata: Metadata = {
  title: "AmyCore",
  description: "Internal AI-assisted video production system",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <StudioShell>{children}</StudioShell>
      </body>
    </html>
  );
}
