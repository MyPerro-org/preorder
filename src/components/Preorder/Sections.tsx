"use client";
// src/components/Preorder/Sections.tsx

import { useState } from "react";
import { FAQS, PLEDGE_LINES } from "@/lib/preorderData";
import { ActivityEntry, CohortsData, CohortDog, timeAgo } from "@/lib/api";
import { downloadWelcomeCard, shareWelcomeCard } from "@/lib/welcomeCard";

export function SavingsSection() {
  return null;
}

/* AaaAaa Pet Wall AaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaa */
const COHORT_SIZE = 20;

function CircleGrid({
  dogs,
  onClaim,
}: {
  dogs: CohortDog[];
  onClaim?: () => void;
}) {
  const nextPosition = dogs.length + 1;

  return (
    <div className="flex flex-wrap gap-3 sm:gap-4 mt-8 sm:mt-10">
      {Array.from({ length: COHORT_SIZE }, (_, i) => {
        const position = i + 1;
        const dog = dogs.find((d) => d.position === position);
        const isTaken = !!dog;
        const isFounding = dog?.tier === "founding";
        const isYours = position === nextPosition && !isTaken;
        const initials = dog?.dogName
          ? dog.dogName.slice(0, 2).toUpperCase()
          : null;

        return (
          <div
            key={i}
            className="group relative flex flex-col items-center gap-1"
          >
            <div
              onClick={isYours ? onClaim : undefined}
              className={`
                w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-full
                flex items-center justify-center transition-all duration-300
                ${
                  isTaken
                    ? isFounding
                      ? "bg-[#1a1000] border-[3px] border-[#EFBF04]"
                      : "bg-[#2a1508] border-[3px] border-[#E8622A]"
                    : isYours
                      ? "bg-transparent border-2 border-dashed border-[#E8622A]/50 po-spot-pulse cursor-pointer hover:border-[#E8622A]"
                      : "bg-transparent border border-dashed border-white/[0.1]"
                }
              `}
            >
              {isTaken ? (
                dog?.dogPhoto ? (
                  <img
                    src={dog.dogPhoto}
                    alt={dog.dogName}
                    className="w-full h-full rounded-full object-cover object-top"
                  />
                ) : (
                  <span
                    className={`font-playfair font-normal text-[16px] sm:text-[18px] ${isFounding ? "text-[#EFBF04]" : "text-[#E8622A]"}`}
                  >
                    {initials}
                  </span>
                )
              ) : isYours ? (
                <span className="font-playfair text-[#E8622A]/60 text-[12px] sm:text-[13px] font-normal">
                  Your dog?
                </span>
              ) : (
                <span className="text-[10px] sm:text-[12px] text-white/15 font-light">
                  #{position}
                </span>
              )}
            </div>

            {isTaken && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#1a1a1a] border border-white/[0.07] rounded-lg px-3 py-2 text-[11px] text-white/60 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                <span
                  className={isFounding ? "text-[#EFBF04]" : "text-[#E8622A]"}
                >
                  {dog?.dogName}
                </span>{" "}
                #{position}
              </div>
            )}
            {isTaken && (
              <span
                className={`text-[12px] sm:text-[13px] font-light text-center truncate max-w-[72px] sm:max-w-[88px] ${isFounding ? "text-[#EFBF04]" : "text-[#E8622A]"}`}
              >
                {dog?.dogName}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function PetWall({
  cohorts,
  onClaim,
  welcomeCard,
}: {
  cohorts: CohortsData;
  onClaim?: () => void;
  welcomeCard?: {
    petName: string;
    ownerName: string;
    cohortNumber: number;
    cohortPosition: number;
    referralCode: string;
    tier: "starter" | "founding";
  } | null;
}) {
  const [activeCohort, setActiveCohort] = useState(0);
  const [downloadingCard, setDownloadingCard] = useState(false);
  const [sharingCard, setSharingCard] = useState(false);
  const cohort1Dogs = cohorts["cohort 1"] ?? [];
  const cohort2Dogs = cohorts["cohort 2"] ?? [];
  const cohort1Full = cohort1Dogs.length >= COHORT_SIZE;

  return (
    <section
      id="wall"
      className="bg-[#0a0a0a] py-20 sm:py-28 px-6 sm:px-10 md:px-20 border-t border-white/[0.04]"
    >
      <div className="max-w-[1100px] mx-auto">
        <p className="text-[12px] font-semibold tracking-[4px] uppercase text-white/20 mb-6 sm:mb-8">
          004 - THE PACK
        </p>
        <div className={welcomeCard ? "grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_560px] gap-8 xl:gap-10 items-start" : ""}>
          <div>
            <h2
              className="font-playfair font-normal text-white leading-[1.08] mb-4 sm:mb-5"
              style={{ fontSize: "clamp(32px, 4.5vw, 64px)" }}
            >
              <span className="text-[#E8622A]">20</span> spots.
              <br />
              That's it.
            </h2>
            <p className="text-[13px] sm:text-[14px] text-white/30 font-light leading-[1.9] max-w-[380px] mb-4">
              Every circle is a pet parent who said yes early.{" "}
              <span className="text-[#E8622A]">Orange</span> for Starter,{" "}
              <span className="text-[#EFBF04]">Gold</span> for Founding. The
              pulsing one is waiting for you.
            </p>
          </div>

          {welcomeCard && (
            <div className="bg-[#111] border border-[rgba(255,102,0,0.25)] rounded-2xl p-6 sm:p-7 w-full">
              <p className="text-[11px] font-semibold tracking-[2px] uppercase text-[#FF6600] mb-2">
                Welcome Card
              </p>
              <h3 className="font-bebas text-[30px] leading-none text-white mb-3">
                Welcome to the Founding Pack!!
              </h3>
              <p className="text-[13px] text-white/65 leading-[1.8]">
                {welcomeCard.tier === "founding"
                  ? "You're officially a key member of the MyPerro journey. Your generous support not only guarantees you priority shipping from our first batch, but also unlocks exclusive benefits only for our Founding Members."
                  : "You're officially part of the MyPerro journey. Your support not only guarantees you early shipping from our first batch, but also unlocks benefits."}
              </p>
              <p className="text-[13px] text-white/65 leading-[1.8] mt-3">
                Welcome to the heart of the community. Let's create the future of smart pet care, together.
              </p>
              <p className="text-[13px] text-white mt-3">-Team MyPerro {"\u{1F43E}"}</p>
              <p className="text-[11px] text-white/35 mt-3">
                {welcomeCard.ownerName} with {welcomeCard.petName} | Cohort {welcomeCard.cohortNumber} | Spot #{welcomeCard.cohortPosition}
              </p>
              <button
                onClick={async () => {
                  if (!welcomeCard) return;
                  try {
                    setDownloadingCard(true);
                    await downloadWelcomeCard(welcomeCard);
                  } finally {
                    setDownloadingCard(false);
                  }
                }}
                disabled={downloadingCard}
                className="mt-4 bg-[#FF6600] text-black font-semibold text-[12px] tracking-wide px-4 py-[10px] rounded-full transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {downloadingCard ? "Preparing..." : "Download Card"}
              </button>
              {typeof navigator !== "undefined" && "share" in navigator && (
                <button
                  onClick={async () => {
                    if (!welcomeCard) return;
                    try {
                      setSharingCard(true);
                      await shareWelcomeCard(welcomeCard);
                    } finally {
                      setSharingCard(false);
                    }
                  }}
                  disabled={sharingCard}
                  className="mt-3 ml-3 bg-white text-black font-semibold text-[12px] tracking-wide px-4 py-[10px] rounded-full transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sharingCard ? "Opening..." : "Share Card"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Cohort tabs */}
        <div className="flex gap-6 mt-8 sm:mt-10 border-b border-white/[0.06]">
          {[
            { label: "Cohort 1", dogs: cohort1Dogs, locked: false },
            { label: "Cohort 2", dogs: cohort2Dogs, locked: !cohort1Full },
          ].map((c, idx) => (
            <button
              key={idx}
              onClick={() => !c.locked && setActiveCohort(idx)}
              disabled={c.locked}
              className={`pb-3 text-[12px] font-semibold tracking-wide transition-colors border-b-2 -mb-[1px] ${
                c.locked
                  ? "text-white/15 cursor-not-allowed border-transparent"
                  : activeCohort === idx
                    ? "text-white border-[#E8622A]"
                    : "text-white/30 border-transparent hover:text-white/55"
              }`}
            >
              {c.label} {c.locked && "(Locked)"}
              {!c.locked && (
                <span className="ml-2 text-[10px] text-white/20 font-light">
                  {c.dogs.length}/{COHORT_SIZE}
                </span>
              )}
            </button>
          ))}
        </div>

        <CircleGrid
          dogs={activeCohort === 0 ? cohort1Dogs : cohort2Dogs}
          onClaim={onClaim}
        />
      </div>
    </section>
  );
}

export function FeedSection({
  activity,
  onClaim,
}: {
  activity: ActivityEntry[];
  onClaim: () => void;
}) {
  return null;
}

/* AaaAaa Steps AaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaa */
export function StepsSection() {
  const steps = [
    {
      n: "01",
      title: "Reserve your spot",
      desc: "A refundable Rs 500 deposit holds your place in the Founding Pack. No risk. Fully cancellable until dispatch.",
    },
    {
      n: "02",
      title: "We build, you wait",
      desc: "Your collar is assembled and tested through April 2026. We keep you updated you'll know exactly where it is at every stage.",
    },
    {
      n: "03",
      title: "Collar ships first",
      desc: "Founding Pack orders dispatch before all others. Your dog is the first in their city wearing it.",
    },
    {
      n: "04",
      title: "You never stop knowing",
      desc: "Real-time GPS. Intelligent alerts. A calm, assured feeling that wherever they wander you'll always know.",
    },
  ];

  return (
    <section
      id="process"
      className="bg-[#0a0a0a] py-20 sm:py-28 px-6 sm:px-10 md:px-20 border-t border-white/[0.04]"
    >
      <div className="max-w-[1100px] mx-auto">
        <p className="text-[12px] font-semibold tracking-[4px] uppercase text-white/20 mb-6 sm:mb-8">
          005 - FOUR STEPS, ONE PROMISE
        </p>
        <h2
          className="font-playfair font-normal text-white leading-[1.08] mb-14 sm:mb-20"
          style={{ fontSize: "clamp(32px, 4.5vw, 64px)" }}
        >
          <span className="text-[#E8622A]">Simple</span> by design.
        </h2>

        <div className="flex flex-col">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className={`flex items-start gap-8 sm:gap-12 py-10 sm:py-12 ${
                i < steps.length - 1 ? "border-b border-white/[0.05]" : ""
              }`}
            >
              <span
                className="font-playfair text-[#E8622A] leading-none shrink-0 w-[56px] sm:w-[80px]"
                style={{ fontSize: "clamp(32px, 4vw, 60px)" }}
              >
                {s.n}
              </span>
              <div className="pt-1">
                <h3
                  className="font-playfair font-normal text-white mb-3 leading-[1.2]"
                  style={{ fontSize: "clamp(18px, 2vw, 26px)" }}
                >
                  {s.title}
                </h3>
                <p className="text-[13px] sm:text-[14px] text-white/30 font-light leading-[1.85] max-w-[560px]">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PledgeSection() {
  return null;
}

/* AaaAaa FAQ AaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaa  */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b border-white/[0.05] py-6 sm:py-7 cursor-pointer group"
      onClick={() => setOpen(!open)}
    >
      <div className="flex justify-between items-start gap-4 sm:gap-6">
        <span
          className="font-playfair font-normal text-white/55 group-hover:text-white/85 transition-colors leading-[1.4]"
          style={{ fontSize: "clamp(14px, 1.5vw, 18px)" }}
        >
          {q}
        </span>
        <span
          className={`text-[#E8622A] text-[20px] sm:text-[22px] shrink-0 transition-transform duration-200 mt-[1px] ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </div>
      {open && (
        <p className="text-[13px] text-white/30 font-light leading-[1.9] mt-4 max-w-[640px]">
          {a}
        </p>
      )}
    </div>
  );
}

export function FaqSection() {
  return (
    <section className="bg-[#0a0a0a] py-20 sm:py-28 px-6 sm:px-10 md:px-20 border-t border-white/[0.04]">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 sm:gap-16 md:gap-20">
          <div>
            <h2
              className="font-playfair font-normal text-white leading-[1.1]"
              style={{ fontSize: "clamp(26px, 3vw, 42px)" }}
            >
              <span className="text-[#E8622A]">Anything on</span>
              <br />
              <span className="text-[#E8622A]">your mind?</span>
            </h2>
          </div>
          <div className="border-t border-white/[0.05]">
            {FAQS.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* AaaAaa Final CTA AaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaaAaa  */
export function FinalCTA({
  remaining,
  onClaim,
}: {
  remaining: number;
  onClaim: (tier?: "starter" | "founding") => void;
}) {
  const comparisonRows = [
    { perk: "Free subscription", starter: "3 months", founding: "6 months" },
    { perk: "Founding merch", starter: "Included", founding: "Merch pack" },
    { perk: "Website feature", starter: "Dog photo", founding: "You + dog story wall" },
    { perk: "Founding stickers", starter: "Included", founding: "Included" },
    { perk: "Onboarding call", starter: "Included", founding: "Included" },
    { perk: "Private WhatsApp channel", starter: "Included", founding: "Included" },
    { perk: "Priority early access", starter: "Not included", founding: "Included" },
    { perk: "Beta testing access", starter: "Not included", founding: "Included" },
    { perk: "Health collar discount", starter: "Not included", founding: "10% off" },
  ];

  return (
    <>
      {/* Reserve Aaa Two-tier pricing */}
      <section
        id="reserve"
        className="bg-[#0a0a0a] py-20 sm:py-28 px-6 sm:px-10 md:px-20 border-t border-white/[0.04] text-center"
      >
        <div className="max-w-[960px] mx-auto">
          <h2
            className="font-playfair font-normal text-white leading-[1.05] mb-4 sm:mb-5"
            style={{ fontSize: "clamp(38px, 6vw, 84px)" }}
          >
            Twenty collars.
            <br />
            Twenty dogs.
            <br />
            <em className="text-[#E8622A]" style={{ fontStyle: "italic" }}>
              Your dog.
            </em>
          </h2>

          <p className="text-[13px] sm:text-[14px] text-white/25 font-light mb-10 sm:mb-14">
            The Founding Pack closes when the last spot is taken.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[980px] mx-auto items-start">
            <div
              className="bg-[#111] border border-white/[0.08] rounded-3xl text-left overflow-hidden transition-transform hover:-translate-y-1 grid"
              style={{
                boxShadow: "0 0 60px rgba(232,97,26,0.04)",
                gridTemplateRows: "360px auto",
              }}
            >
              <div className="p-6 sm:p-8 flex flex-col">
                <div className="inline-flex items-center gap-2 border border-[#E8622A]/25 text-[#E8622A]/75 text-[9px] font-semibold tracking-[2px] uppercase px-3 py-[4px] rounded-full mb-4">
                  <span className="w-[5px] h-[5px] rounded-full bg-[#E8622A]" />
                  Starter Pack
                </div>
                <h3 className="font-playfair font-normal text-white text-[32px] leading-[1.1] mb-1">
                  Essentials
                </h3>
                <p className="text-[14px] text-white/55 mb-8">
                  Great way to lock your place early
                </p>
                <div className="flex items-end gap-2 mb-8">
                  <p
                    className="font-playfair font-normal text-white leading-none"
                    style={{ fontSize: "clamp(44px, 6vw, 64px)" }}
                  >
                    <sup className="text-[18px] align-super mr-[2px]">Rs</sup>500
                  </p>
                  <p className="text-[22px] text-white/35 mb-1">one-time token</p>
                </div>
                <button
                  onClick={() => onClaim("starter")}
                  className="w-full bg-white text-black font-semibold text-[16px] py-[11px] rounded-xl transition-opacity hover:opacity-90 mt-auto"
                >
                  Join Starter Pack
                </button>
                <p className="text-[12px] text-white/20 text-center mt-3 font-mono tracking-wide">
                  Credited to final collar price
                </p>
              </div>
              <div className="border-t border-white/[0.08] p-6 sm:p-8 mt-auto">
                <p className="text-[14px] font-semibold text-white/75 mb-4 h-[56px] flex items-end">
                  Includes:
                </p>
                <ul className="flex flex-col gap-3">
                  {[
                    "3 months of free subscription",
                    "Exclusive MyPerro founding merch",
                    "Your dog's photo featured on our website",
                    "Exclusive Founding Pack sticker set delivered with collar",
                    "One-on-one onboarding call with the MyPerro team",
                    "Direct private WhatsApp channel with the founding team",
                  ].map((perk) => (
                    <li
                      key={perk}
                      className="flex items-start gap-3 text-[14px] text-white/60 font-light leading-[1.5]"
                    >
                      <span className="text-white/45 mt-[1px]">-</span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div
              className="bg-[#111] border border-[#F59E0B]/35 rounded-3xl text-left overflow-hidden transition-transform hover:-translate-y-1 grid"
              style={{
                boxShadow: "0 0 60px rgba(245,158,11,0.06)",
                gridTemplateRows: "360px auto",
              }}
            >
              <div className="p-6 sm:p-8 flex flex-col">
                <div className="inline-flex items-center gap-2 border border-[#F59E0B]/35 text-[#F59E0B]/80 text-[9px] font-semibold tracking-[2px] uppercase px-3 py-[4px] rounded-full mb-4">
                  <span className="w-[5px] h-[5px] rounded-full bg-[#F59E0B]" />
                  Founding Pack
                </div>
                <h3 className="font-playfair font-normal text-white text-[32px] leading-[1.1] mb-1">
                  Founding Member
                </h3>
                <p className="text-[14px] text-[#F59E0B]/75 mb-8">
                  Priority access and long-term benefits
                </p>
                <div className="flex items-end gap-2 mb-8">
                  <p
                    className="font-playfair font-normal text-[#F59E0B] leading-none"
                    style={{ fontSize: "clamp(44px, 6vw, 64px)" }}
                  >
                    <sup className="text-[18px] align-super mr-[2px]">Rs</sup>2,499
                  </p>
                  <p className="text-[22px] text-white/35 mb-1">one-time token</p>
                </div>
                <button
                  onClick={() => onClaim("founding")}
                  className="w-full bg-white text-black font-semibold text-[16px] py-[11px] rounded-xl transition-opacity hover:opacity-90 mt-auto"
                >
                  Join Founding Pack
                </button>
                <p className="text-[12px] text-white/20 text-center mt-3 font-mono tracking-wide">
                  Credited to final collar price
                </p>
              </div>
              <div className="border-t border-white/[0.08] p-6 sm:p-8 mt-auto">
                <p className="text-[14px] font-semibold text-white/75 mb-4 h-[56px] flex items-end">
                  Everything in Starter, plus:
                </p>
                <ul className="flex flex-col gap-3">
                  {[
                    "6 months of free subscription",
                    "Exclusive MyPerro founding merch pack",
                    "Featured on our Founding Pack wall: you and your dog's story on our website",
                    "Exclusive Founding Pack sticker set delivered with collar",
                    "One-on-one onboarding call with the MyPerro team",
                    "Direct private WhatsApp channel with the founding team",
                    "Priority early access",
                    "Beta tester access before public launch",
                    "10% discount on health collar",
                  ].map((perk) => (
                    <li
                      key={perk}
                      className="flex items-start gap-3 text-[14px] text-white/60 font-light leading-[1.5]"
                    >
                      <span className="text-white/45 mt-[1px]">-</span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="max-w-[980px] mx-auto mt-8 sm:mt-10">
            <div className="rounded-2xl border border-white/[0.08] bg-[linear-gradient(180deg,#121212_0%,#0f0f0f_100%)] p-4 sm:p-5">
              <div className="mb-4 sm:mb-5">
                <div className="md:hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h4 className="text-[13px] sm:text-[14px] tracking-[1.5px] uppercase font-semibold text-white/55">
                    Perk Comparison
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-9 items-center justify-center px-3 rounded-full border border-[#E8622A]/30 bg-[#E8622A]/10 text-[#E8622A] text-[11px] font-semibold tracking-wide leading-none">
                      Starter Rs 500
                    </span>
                    <span className="inline-flex h-9 items-center justify-center px-3 rounded-full border border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#F59E0B] text-[11px] font-semibold tracking-wide leading-none">
                      Founding Rs 2,499
                    </span>
                  </div>
                </div>

                <div className="hidden md:grid grid-cols-[minmax(0,1fr)_220px_220px] items-center gap-0">
                  <h4 className="text-[13px] tracking-[1.5px] uppercase font-semibold text-white/55">
                    Perk Comparison
                  </h4>
                  <div className="flex justify-center">
                    <span className="inline-flex h-9 items-center justify-center px-3 rounded-full border border-[#E8622A]/30 bg-[#E8622A]/10 text-[#E8622A] text-[11px] font-semibold tracking-wide leading-none">
                      Starter Rs 500
                    </span>
                  </div>
                  <div className="flex justify-center">
                    <span className="inline-flex h-9 items-center justify-center px-3 rounded-full border border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#F59E0B] text-[11px] font-semibold tracking-wide leading-none">
                      Founding Rs 2,499
                    </span>
                  </div>
                </div>
              </div>

              <div className="md:hidden">
                <p className="text-[11px] text-white/35 mb-3">Swipe plans</p>
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <article className="snap-start shrink-0 w-[86vw] rounded-xl border border-[#E8622A]/25 bg-[#12100d] p-4">
                    <p className="text-[12px] uppercase tracking-[1.5px] text-[#E8622A] font-semibold mb-3">
                      Starter Pack
                    </p>
                    <ul className="space-y-2.5">
                      {comparisonRows.map((row) => {
                        const included = row.starter !== "Not included";
                        return (
                          <li key={row.perk} className="flex items-start justify-between gap-3">
                            <span className="text-[12px] text-white/70">{row.perk}</span>
                            <span className={`text-[12px] font-medium text-right ${included ? "text-white/90" : "text-white/35"}`}>
                              {included ? row.starter : "Not included"}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </article>

                  <article className="snap-start shrink-0 w-[86vw] rounded-xl border border-[#F59E0B]/30 bg-[#131106] p-4">
                    <p className="text-[12px] uppercase tracking-[1.5px] text-[#F59E0B] font-semibold mb-3">
                      Founding Pack
                    </p>
                    <ul className="space-y-2.5">
                      {comparisonRows.map((row) => {
                        const included = row.founding !== "Not included";
                        return (
                          <li key={row.perk} className="flex items-start justify-between gap-3">
                            <span className="text-[12px] text-white/70">{row.perk}</span>
                            <span className={`text-[12px] font-medium text-right ${included ? "text-white/95" : "text-white/35"}`}>
                              {included ? row.founding : "Not included"}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </article>
                </div>
              </div>

              <div className="hidden md:block rounded-xl border border-white/[0.06] overflow-hidden">
                <div className="grid grid-cols-[minmax(0,1fr)_220px_220px] bg-white/[0.03]">
                  <div className="px-5 py-3 text-[12px] uppercase tracking-[1.4px] text-white/40 font-semibold">
                    Feature
                  </div>
                  <div className="px-5 py-3 text-[12px] uppercase tracking-[1.4px] text-[#E8622A] font-semibold text-center border-l border-white/[0.06]">
                    Starter
                  </div>
                  <div className="px-5 py-3 text-[12px] uppercase tracking-[1.4px] text-[#F59E0B] font-semibold text-center border-l border-white/[0.06]">
                    Founding
                  </div>
                </div>

                {comparisonRows.map((row, idx) => {
                  const starterIncluded = row.starter !== "Not included";
                  const foundingIncluded = row.founding !== "Not included";
                  return (
                    <div
                      key={row.perk}
                      className={`grid grid-cols-[minmax(0,1fr)_220px_220px] ${idx < comparisonRows.length - 1 ? "border-t border-white/[0.06]" : ""}`}
                    >
                      <div className="px-5 py-3.5 text-[14px] text-white/80">{row.perk}</div>
                      <div className="px-5 py-3.5 text-[13px] text-center border-l border-white/[0.06]">
                        <span className={starterIncluded ? "text-white/85" : "text-white/35"}>
                          {starterIncluded ? row.starter : "Not included"}
                        </span>
                      </div>
                      <div className="px-5 py-3.5 text-[13px] text-center border-l border-white/[0.06]">
                        <span className={foundingIncluded ? "text-white/95" : "text-white/35"}>
                          {foundingIncluded ? row.founding : "Not included"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple by design - Steps */}
      {/* NOTE: StepsSection is rendered separately in page.tsx, so order is controlled there */}

      {/* Pledge */}
      <section className="bg-[#0a0a0a] py-20 sm:py-24 px-6 sm:px-10 md:px-20 border-t border-white/[0.04]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 items-center">
          <h2
            className="font-playfair font-normal text-white leading-[1.1]"
            style={{ fontSize: "clamp(24px, 3vw, 40px)" }}
          >
            We built MyPerro because
            <br />
            <span className="text-white/30">our own pet got lost once.</span>
          </h2>
          <ul className="flex flex-col gap-4">
            {[
              "We will never sell your pet's data to advertisers, ever",
              "If we don't ship, every rupee is refunded, no questions asked",
              "Founding Pack members keep their perks forever, even post-launch",
              "Featured on our Founding Pack wall: your dog\u2019s story on our website",
              "We will share real updates, delays included. No radio silence",
              "Your pet's safety is the only thing we optimise for",
            ].map((line) => (
              <li
                key={line}
                className="flex items-start gap-3 text-[13px] text-white/35 font-light leading-[1.7]"
              >
                <span className="text-[#E8622A] shrink-0 mt-[2px]">-</span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
