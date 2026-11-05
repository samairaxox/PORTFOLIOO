import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Samaira Sharma — Notes from the in-between",
  description: "Software engineering, artificial intelligence, and FinTech. An editorial portfolio by Samaira Sharma.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
