import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Samaira Sharma — Software Engineer",
  description: "Samaira Sharma is a software engineer exploring artificial intelligence, thoughtful product engineering, and financial technology.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
