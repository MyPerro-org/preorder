"use client";
// src/app/(preorder)/preorder/page.tsx

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { Instagram, Linkedin, Twitter } from "lucide-react";
import {
  fetchActivity,
  fetchCohorts,
  fetchSpotsStatus,
  ActivityEntry,
  CohortsData,
  SpotsStatus,
  timeAgo,
} from "@/lib/api";

import ActivityBar from "@/components/Preorder/ActivityBar";
import Hero from "@/components/Preorder/Hero";
import TickerStrip from "@/components/Preorder/TickerStrip";
import PerksSection from "@/components/Preorder/PerksSection";
import PreorderModal from "@/components/Preorder/PreorderModal";
import type { PackTier } from "@/components/Preorder/PreorderModal";
import { SuccessModal, Confetti } from "@/components/Preorder/SuccessModal";
import {
  SavingsSection,
  PetWall,
  FeedSection,
  StepsSection,
  PledgeSection,
  FaqSection,
  FinalCTA,
} from "@/components/Preorder/Sections";

interface PaymentResult {
  petName: string;
  ownerName: string;
  cohortNumber: number;
  cohortPosition: number;
  referralCode: string;
  tier: PackTier;
}

const POLL_MS = 30_000;
const SUCCESS_CARD_STORAGE_KEY = "myperro_success_card";

/* ── Live toast ──────────────────────────────────────────────── */
function LiveToast({ activity }: { activity: ActivityEntry[] }) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<ActivityEntry | null>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (activity.length === 0) return;
    const show = () => {
      setCurrent(activity[idx % activity.length]);
      setVisible(true);
      setTimeout(() => setVisible(false), 4000);
      setIdx((i) => i + 1);
    };
    const first = setTimeout(show, 3000);
    const interval = setInterval(show, 8000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [activity, idx]);

  if (!current) return null;
  const initials = current.parentName?.charAt(0).toUpperCase() ?? "?";
  const firstName = current.parentName?.split(" ")[0] ?? "Someone";

  return (
    <div
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[600] transition-all duration-500 max-w-[260px] sm:max-w-none ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-3 bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-3 shadow-2xl">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#E8622A]/20 border border-[#E8622A]/30 flex items-center justify-center shrink-0">
          <span className="font-playfair text-[#E8622A] text-[13px]">
            {initials}
          </span>
        </div>
        <div>
          <p className="text-[12px] sm:text-[13px] text-white/80 font-light leading-[1.3]">
            <span className="font-semibold">{firstName}</span> · {current.city}
          </p>
          <p className="text-[10px] sm:text-[11px] text-white/30 font-light mt-[1px]">
            Reserved spot #{current.position} · {timeAgo(current.claimedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────── */
export default function PreorderPage() {
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [cohorts, setCohorts] = useState<CohortsData>({
    "cohort 1": [],
    "cohort 2": [],
  });
  const [spots, setSpots] = useState<SpotsStatus>({
    currentCohortNumber: 1,
    claimed: 0,
    total: 20,
    remaining: 20,
    totalPaidOverall: 0,
    lastClaimedAt: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [succOpen, setSuccOpen] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [teaserPet, setTeaserPet] = useState("");
  const [selectedTier, setSelectedTier] = useState<PackTier>("starter");
  const [showNav, setShowNav] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedFormData, setSavedFormData] = useState({});
  const [hasTrackedPageView, setHasTrackedPageView] = useState(false);

  const loadAll = useCallback(async () => {
    const [act, coh, sp] = await Promise.all([
      fetchActivity(20),
      fetchCohorts(),
      fetchSpotsStatus(),
    ]);
    setActivity(act);
    setCohorts(coh);
    setSpots(sp);
  }, []);

  useEffect(() => {
    if (!hasTrackedPageView) {
      posthog.capture("preorder_page_view", {
        page: "/preorder",
      });
      setHasTrackedPageView(true);
    }
  }, [hasTrackedPageView]);

  useEffect(() => {
    loadAll();
    const id = setInterval(loadAll, POLL_MS);
    return () => clearInterval(id);
  }, [loadAll]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(SUCCESS_CARD_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<PaymentResult>;
      if (
        !parsed.petName ||
        !parsed.ownerName ||
        !parsed.cohortNumber ||
        !parsed.cohortPosition ||
        !parsed.referralCode
      ) {
        return;
      }
      const restored: PaymentResult = {
        petName: parsed.petName,
        ownerName: parsed.ownerName,
        cohortNumber: parsed.cohortNumber,
        cohortPosition: parsed.cohortPosition,
        referralCode: parsed.referralCode,
        tier: parsed.tier === "founding" ? "founding" : "starter",
      };
      setResult(restored);
      setSuccOpen(false);
    } catch {
      // ignore invalid local storage data
    }
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      setShowNav(y <= lastY);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSuccess = useCallback(
    async (data: PaymentResult) => {
      posthog.capture("preorder_lead_confirmed", {
        tier: data.tier,
        cohortNumber: data.cohortNumber,
        cohortPosition: data.cohortPosition,
      });
      setResult(data);
      setModalOpen(false);
      setSuccOpen(true);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          SUCCESS_CARD_STORAGE_KEY,
          JSON.stringify(data),
        );
      }
      setConfetti(true);
      setTimeout(() => setConfetti(false), 5500);
      await loadAll();
    },
    [loadAll],
  );

  const lastClaimed = spots.lastClaimedAt
    ? timeAgo(spots.lastClaimedAt)
    : "recently";
  const openModal = (
    tier: PackTier = "starter",
    source: "hero" | "pet_wall" | "final_cta" | "unknown" = "unknown",
  ) => {
    posthog.capture("preorder_modal_opened", {
      tier,
      source,
      spots_remaining: spots.remaining,
      spots_claimed: spots.claimed,
    });
    setSelectedTier(tier);
    setModalOpen(true);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    ["PRODUCT", "#collar"],
    ["PERKS", "#perks"],
    ["HOW IT WORKS", "#process"],
    ["FOUNDING PACK", "#wall"],
  ];

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen overflow-x-hidden">
      <Confetti show={confetti} />

      {/* ── Navbar ────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          showNav ? "translate-y-0" : "-translate-y-full"
        } ${
          scrolled
            ? "bg-[rgba(10,10,10,0.96)] backdrop-blur-xl border-b border-white/[0.05]"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-6 sm:px-10 md:px-16 lg:px-20 py-4 sm:py-5">
          <img
            src="/myperro-logo.png"
            alt="MyPerro"
            className="h-7 sm:h-9 lg:h-11 opacity-85 -ml-1 shrink-0"
          />

          {/* Desktop nav links — only show at lg (1024px+) */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-14">
            {navLinks.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-[11px] font-semibold tracking-[2px] text-white/35 hover:text-white/70 transition-colors whitespace-nowrap"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Spots remaining — only show at lg to avoid crowding */}
            <span className="hidden lg:block text-[14px] text-white/60 font-light tracking-wide whitespace-nowrap">
              <span className="text-[#E8622A] font-semibold text-[15px]">
                {spots.remaining}
              </span>{" "}
              spots left
            </span>

            {/* Reserve button */}
            <button
              onClick={() => {
                posthog.capture("preorder_nav_reserve_click", {
                  spots_remaining: spots.remaining,
                });
                document
                  .getElementById("reserve")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-[#E8622A] text-white font-semibold text-[11px] sm:text-[12px] tracking-wide px-4 sm:px-5 lg:px-6 py-[8px] sm:py-[10px] rounded-full transition-opacity hover:opacity-90 whitespace-nowrap"
            >
              Reserve Spot
            </button>

            {/* Hamburger — visible below lg */}
            <button
              onClick={() => {
                const next = !mobileMenuOpen;
                setMobileMenuOpen(next);
                posthog.capture("preorder_mobile_menu_toggle", {
                  is_open: next,
                });
              }}
              className="lg:hidden flex flex-col gap-[5px] p-1 ml-1"
              aria-label="Menu"
            >
              <span
                className={`block w-5 h-[1.5px] bg-white/50 transition-transform duration-200 ${mobileMenuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`}
              />
              <span
                className={`block w-5 h-[1.5px] bg-white/50 transition-opacity duration-200 ${mobileMenuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block w-5 h-[1.5px] bg-white/50 transition-transform duration-200 ${mobileMenuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Mobile/tablet dropdown menu — visible below lg */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[rgba(10,10,10,0.98)] backdrop-blur-xl border-t border-white/[0.05] px-6 py-6 flex flex-col gap-6">
            {navLinks.map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[12px] font-semibold tracking-[2px] text-white/40 hover:text-white/70 transition-colors"
              >
                {label}
              </a>
            ))}
            <div className="pt-2 border-t border-white/[0.05] text-[12px] text-white/20 font-light">
              <span className="text-[#E8622A]">{spots.remaining}</span> spots
              remaining
            </div>
          </div>
        )}
      </header>

      {/* top padding to offset fixed navbar */}
      <div className="pt-[60px] sm:pt-[72px]" />

      {/* ── Sections ──────────────────────────────────────── */}
      <Hero
        claimed={spots.claimed}
        total={spots.total}
        lastClaimed={lastClaimed}
        teaserPet={teaserPet}
        onTeaserChange={setTeaserPet}
        onClaim={() => openModal("starter", "hero")}
      />
      <TickerStrip />
      <PerksSection />
      <PetWall
        cohorts={cohorts}
        onClaim={() => openModal("starter", "pet_wall")}
        welcomeCard={result}
      />
      <FinalCTA
        remaining={spots.remaining}
        onClaim={(tier) => openModal(tier, "final_cta")}
      />
      <StepsSection />
      <FaqSection />

      <footer className="relative mt-10 border-t border-white/[0.06] bg-[radial-gradient(90%_120%_at_50%_0%,rgba(232,98,42,0.12)_0%,rgba(10,10,10,0)_50%),#0a0a0a] overflow-visible">
        <img
          src="/footer-dog.svg"
          alt=""
          aria-hidden="true"
          className="hidden lg:block absolute left-0 -top-24 h-[calc(100%+96px)] w-auto max-w-none opacity-90 pointer-events-none select-none"
        />
        <div className="w-full lg:w-[62%] ml-auto px-6 sm:px-10 md:px-20 py-10 sm:py-12">
          <div className="flex items-center justify-between gap-5 pb-6 border-b border-white/[0.06]">
            <img
              src="/myperro-logo.png"
              alt="MyPerro"
              className="h-10 sm:h-12 w-auto object-contain opacity-90"
            />
            <div className="flex items-center gap-2">
              {[
                {
                  href: "https://www.instagram.com/myperro.in/",
                  icon: Instagram,
                  label: "Instagram",
                },
                {
                  href: "https://www.linkedin.com/company/myperroindia?trk=profile-position",
                  icon: Linkedin,
                  label: "LinkedIn",
                },
                { href: "https://x.com/MyPerro_", icon: Twitter, label: "X" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#E8622A]/35 bg-[#E8622A]/10 text-[#E8622A] hover:bg-[#E8622A] hover:text-black transition-colors flex items-center justify-center"
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 pt-7 pb-6">
            <div>
              <h3 className="text-[12px] uppercase tracking-[2px] font-semibold text-white/45 mb-4">
                Company
              </h3>
              <ul className="space-y-2.5 text-[18px] sm:text-[20px] md:text-[18px] font-light">
                <li>
                  <Link
                    href="/about"
                    className="text-white/85 hover:text-[#E8622A] transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about#mission"
                    className="text-white/85 hover:text-[#E8622A] transition-colors"
                  >
                    Our Mission
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-white/85 hover:text-[#E8622A] transition-colors"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[12px] uppercase tracking-[2px] font-semibold text-white/45 mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2.5 text-[18px] sm:text-[20px] md:text-[18px] font-light">
                <li>
                  <Link
                    href="/"
                    className="text-white/85 hover:text-[#E8622A] transition-colors"
                  >
                    Smart Collar
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blogs"
                    className="text-white/85 hover:text-[#E8622A] transition-colors"
                  >
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="text-white/85 hover:text-[#E8622A] transition-colors"
                  >
                    Home
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h3 className="text-[12px] uppercase tracking-[2px] font-semibold text-white/45 mb-4">
                Support
              </h3>
              <ul className="space-y-2.5 text-[18px] sm:text-[20px] md:text-[18px] font-light">
                <li>
                  <Link
                    href="/contact"
                    className="text-white/85 hover:text-[#E8622A] transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/preorder#faq"
                    className="text-white/85 hover:text-[#E8622A] transition-colors"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-white/85 hover:text-[#E8622A] transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <p className="pt-5 border-t border-white/[0.06] text-[12px] text-white/35 font-light">
            (c) {new Date().getFullYear()} MyPerro. All rights reserved.
          </p>
        </div>
      </footer>

      <LiveToast activity={activity} />

      {/* Modals */}
      <PreorderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleSuccess}
        seedPet={teaserPet}
        tier={selectedTier}
        savedFormData={savedFormData}
        onFormChange={setSavedFormData}
      />
      {result && (
        <SuccessModal
          open={succOpen}
          onClose={() => setSuccOpen(false)}
          petName={result.petName}
          ownerName={result.ownerName}
          cohortNumber={result.cohortNumber}
          cohortPosition={result.cohortPosition}
          referralCode={result.referralCode}
          tier={result.tier}
        />
      )}
    </div>
  );
}
