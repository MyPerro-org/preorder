// src/app/(preorder)/preorder/layout.tsx
import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alpha Pack ",
  description:
    "Reserve your MyPerro smart collar. India's first GPS pet collar.",
};

export default function PreorderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${playfair.variable} bg-[#0a0a0a] text-white min-h-screen overflow-x-hidden`}
    >
      {children}
    </div>
  );
}
