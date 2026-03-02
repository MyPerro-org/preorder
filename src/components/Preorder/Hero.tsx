"use client";
// src/components/Preorder/Hero.tsx

import { useEffect, useState } from "react";

interface HeroProps {
  claimed: number;
  total: number;
  lastClaimed: string;
  teaserPet: string;
  onTeaserChange: (v: string) => void;
  onClaim: () => void;
}

export default function Hero({
  claimed,
  total,
  lastClaimed,
  teaserPet,
  onTeaserChange,
  onClaim,
}: HeroProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative min-h-screen flex items-center bg-[#0a0a0a] overflow-hidden">
      {/* ── Dog image ─────────────────────────────────────────
          Mobile: full-width background, heavily faded
          Desktop: right 52%, lightly faded               */}
      <div className="absolute inset-0 md:left-auto md:right-0 md:w-[52%] pointer-events-none select-none">
        {/* Mobile: strong left fade so text is readable */}
        <div
          className="absolute inset-0 z-10 md:hidden"
          style={{
            background:
              "linear-gradient(to right, #0a0a0a 40%, rgba(10,10,10,0.6) 100%)",
          }}
        />
        {/* Desktop: narrow left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 z-10 hidden md:block"
          style={{
            width: "340px",
            background:
              "linear-gradient(to right, #0a0a0a 20%, transparent 100%)",
          }}
        />
        {/* bottom fade */}
        <div
          className="absolute left-0 right-0 bottom-0 h-[220px] z-10"
          style={{
            background: "linear-gradient(to top, #0a0a0a, transparent)",
          }}
        />
        {/* top fade */}
        <div
          className="absolute left-0 right-0 top-0 h-[130px] z-10"
          style={{
            background: "linear-gradient(to bottom, #0a0a0a, transparent)",
          }}
        />

        <img
          src="/dog-hero.jpg"
          alt="Dog"
          className="w-full h-full object-cover object-[30%_20%]"
          onError={(e) => {
            (e.target as HTMLImageElement).style.opacity = "0";
          }}
        />
        {/* dark tint — stronger on mobile */}
        <div className="absolute inset-0 bg-[#0a0a0a]/60 md:bg-[#0a0a0a]/30" />
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      <div
        className="relative z-10 flex flex-col w-full md:max-w-[600px]
                      px-6 sm:px-10 md:px-20
                      pt-[110px] sm:pt-[120px]
                      pb-16 sm:pb-20"
      >
        {/* Live badge */}
        <div className="flex items-center gap-[10px] mb-7 sm:mb-10">
          <span className="w-[7px] h-[7px] bg-[#E8622A] rounded-full po-blink shrink-0" />
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-[3px] uppercase text-[#E8622A]">
            Founding Pack — Live Now
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-playfair font-normal text-white leading-[1.08] mb-6 sm:mb-8 tracking-[-0.01em]"
          style={{ fontSize: "clamp(42px, 6.5vw, 72px)" }}
        >
          Know where
          <br />
          they are.
          <br />
          <em className="text-[#E8622A]" style={{ fontStyle: "italic" }}>
            Always.
          </em>
        </h1>

        <p className="text-[14px] sm:text-[15px] text-white/45 font-light leading-[1.85] max-w-[420px] mb-8 sm:mb-10">
          India's first AI-powered GPS collar with real-time tracking and
          intelligent geo-fencing. The Founding Pack unlocks exclusive pricing
          and limited perks.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 mb-4">
          <button
            onClick={() =>
              document
                .getElementById("reserve")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-[#E8622A] text-white font-semibold text-[14px] px-8 py-[13px] sm:py-[14px] rounded-full transition-opacity hover:opacity-90 w-fit"
          >
            Reserve your spot →
          </button>
          <a
            href="#collar"
            className="text-[13px] text-white/30 font-light hover:text-white/55 transition-colors pl-1 sm:pl-0"
          >
            Explore ↓
          </a>
        </div>

        {mounted && (
          <p className="mt-6 text-[12px] text-white/20 font-light">
            Pack Status
            <span className="ml-2 text-white/40">
              {claimed} / {total} claimed
            </span>
          </p>
        )}
      </div>
    </section>
  );
}
