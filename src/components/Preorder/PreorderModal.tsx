"use client";
// src/components/Preorder/PreorderModal.tsx

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { COLLAR_COLOURS, REFERRAL_SOURCES } from "@/lib/preorderData";
import { submitOrder, confirmPayment, validateReferralCode } from "@/lib/api";

export type PackTier = "starter" | "founding";
const isPackTier = (value: unknown): value is PackTier =>
  value === "starter" || value === "founding";

const TIER_CONFIG = {
  starter: {
    amount: 500,
    amountPaise: 50000,
    label: "Scout Pack",
    description: "Scout Pack - Rs 500 token",
    collarRemainder: "Rs 4,500",
    retailPrice: "Rs 5,000",
    badgeLabel: "Scout Pack",
    accentColor: "#E8622A",
    footerNote:
      "Rs 500 credited to collar price | Remaining Rs 4,500 before delivery | 100% refundable",
  },
  founding: {
    amount: 2499,
    amountPaise: 249900,
    label: "Founding Member",
    description: "Founding Member - Rs 2,499",
    collarRemainder: "Rs 2,501",
    retailPrice: "Rs 4,999",
    badgeLabel: "Alpha Pack",
    accentColor: "#F59E0B",
    footerNote:
      "Rs 2,499 credited to collar price | Remaining Rs 2,501 before delivery | Fully refundable",
  },
} as const;

const INDIA_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Chandigarh",
  "Puducherry",
];

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (result: {
    petName: string;
    ownerName: string;
    cohortNumber: number;
    cohortPosition: number;
    referralCode: string;
    tier: PackTier;
  }) => void;
  seedPet: string;
  tier?: PackTier;
  savedFormData?: any;
  onFormChange?: (data: any) => void;
}

type PayState = "idle" | "submitting" | "paying" | "verifying" | "error";

const inputCls =
  "w-full bg-[#0a0a0a] border border-white/[0.07] rounded-xl text-white text-[14px] font-light px-4 py-[13px] outline-none placeholder:text-white/20 focus:border-[#E8622A]/50 transition-colors mb-4";

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[11px] font-semibold tracking-[1.5px] uppercase text-white/25 mb-2">
    {children}
  </label>
);

export default function PreorderModal({
  open,
  onClose,
  onSuccess,
  seedPet,
  tier = "starter",
  savedFormData,
  onFormChange,
}: Props) {
  const tierConfig = TIER_CONFIG[tier];
  const [name, setName] = useState("");
  const [dogsname, setDogsname] = useState("");
  const [mail, setMail] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [isStateMenuOpen, setIsStateMenuOpen] = useState(false);
  const [stateQuery, setStateQuery] = useState("");
  const [source, setSource] = useState("Instagram");
  const [dogPhoto, setDogPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [hasReferral, setHasReferral] = useState(false);
  const [refCode, setRefCode] = useState("");
  const [refStatus, setRefStatus] = useState<
    "idle" | "checking" | "ok" | "err"
  >("idle");
  const [isRazorpayReady, setIsRazorpayReady] = useState(false);
  const [payState, setPayState] = useState<PayState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [shake, setShake] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const stateMenuRef = useRef<HTMLDivElement>(null);
  const referralCheckTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const latestReferralCodeRef = useRef("");
  const filteredStates = INDIA_STATES.filter((s) =>
    s.toLowerCase().includes(stateQuery.trim().toLowerCase()),
  );

  useEffect(() => {
    if (open) setDogsname(seedPet || "");
  }, [open, seedPet]);

  useEffect(() => {
    if (!open) {
      setPayState("idle");
      setErrorMsg("");
      if (referralCheckTimeoutRef.current)
        clearTimeout(referralCheckTimeoutRef.current);
    }
  }, [open]);

  useEffect(() => {
    if (open && savedFormData) {
      if (savedFormData.name) setName(savedFormData.name);
      if (savedFormData.mail) setMail(savedFormData.mail);
      if (savedFormData.phoneno) setPhoneno(savedFormData.phoneno);
      if (savedFormData.address) setAddress(savedFormData.address);
      if (savedFormData.city) setCity(savedFormData.city);
      if (savedFormData.stateName) setStateName(savedFormData.stateName);
      if (savedFormData.dogsname) setDogsname(savedFormData.dogsname);
    }
  }, [open]);

  useEffect(() => {
    if (open && onFormChange) {
      onFormChange({ name, mail, phoneno, address, city, stateName, dogsname });
    }
  }, [name, mail, phoneno, address, city, stateName, dogsname]);

  useEffect(
    () => () => {
      if (referralCheckTimeoutRef.current)
        clearTimeout(referralCheckTimeoutRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!isStateMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        stateMenuRef.current &&
        !stateMenuRef.current.contains(event.target as Node)
      ) {
        setIsStateMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isStateMenuOpen]);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Photo must be under 5MB.");
      return;
    }
    setDogPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setErrorMsg("");
  };

  const handleRefCode = (val: string) => {
    const normalized = val.toUpperCase();
    const trimmed = normalized.trim();
    setRefCode(normalized);
    latestReferralCodeRef.current = trimmed;
    if (referralCheckTimeoutRef.current)
      clearTimeout(referralCheckTimeoutRef.current);
    if (!trimmed || trimmed.length < 6) {
      setRefStatus("idle");
      return;
    }
    setRefStatus("checking");
    referralCheckTimeoutRef.current = setTimeout(async () => {
      try {
        const v = await validateReferralCode(trimmed);
        if (latestReferralCodeRef.current !== trimmed) return;
        setRefStatus(v.valid ? "ok" : "err");
      } catch {
        if (latestReferralCodeRef.current !== trimmed) return;
        setRefStatus("err");
      }
    }, 350);
  };

  const submit = async () => {
    if (
      !name.trim() ||
      !dogsname.trim() ||
      !mail.trim() ||
      !phoneno.trim() ||
      !address.trim() ||
      !city.trim()
    ) {
      setShake(true);
      setTimeout(() => setShake(false), 450);
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    if (!dogPhoto) {
      setShake(true);
      setTimeout(() => setShake(false), 450);
      setErrorMsg("Please upload a photo of your dog.");
      return;
    }
    if (hasReferral && refCode.trim()) {
      if (refStatus === "checking") {
        setErrorMsg("Checking referral code. Please wait.");
        return;
      }
      if (refStatus !== "ok") {
        setErrorMsg("Please enter a valid referral code or uncheck referral.");
        return;
      }
    }
    setPayState("submitting");
    setErrorMsg("");
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("phoneno", phoneno.trim());
      formData.append("address", address.trim());
      formData.append("city", city.trim());
      if (stateName.trim()) formData.append("state", stateName.trim());
      formData.append("mail", mail.trim());
      formData.append("dogsname", dogsname.trim());
      formData.append("dogphoto", dogPhoto);
      formData.append("tier", tier);
      if (hasReferral && refStatus === "ok" && refCode.trim())
        formData.append("referralCode", refCode.trim().toUpperCase());

      const submitRes: any = await submitOrder(formData);
      const submissionId = submitRes?.data?._id ?? submitRes?.data?.data_id;
      if (!submissionId)
        throw new Error("Submission ID missing from /submit response.");

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey)
        throw new Error("Razorpay key is missing in frontend env.");

      setPayState("paying");
      await new Promise<void>((resolve, reject) => {
        if (!isRazorpayReady || !(window as any).Razorpay) {
          reject(
            new Error("Payment gateway is still loading. Please try again."),
          );
          return;
        }
        const rzp = new (window as any).Razorpay({
          key: razorpayKey,
          amount: tierConfig.amountPaise,
          currency: "INR",
          name: "MyPerro",
          description: tierConfig.description,
          prefill: { name, email: mail, contact: phoneno },
          theme: { color: tierConfig.accentColor },
          modal: {
            confirm_close: true,
            ondismiss: () => reject(new Error("cancelled")),
          },
          handler: async (response: any) => {
            try {
              setPayState("verifying");
              if (!response?.razorpay_payment_id)
                throw new Error("Missing payment id from Razorpay.");
              const data = await confirmPayment({
                submissionId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
              });
              if (!data?.data)
                throw new Error(
                  "Invalid payment success response from backend.",
                );
              const resolvedTier: PackTier = isPackTier(data.data.tier)
                ? data.data.tier
                : tier;
              onSuccess({
                petName: dogsname,
                ownerName: name,
                cohortNumber: data.data.cohortNumber,
                cohortPosition: data.data.cohortPosition,
                referralCode: data.data.referralCode,
                tier: resolvedTier,
              });
              resolve();
            } catch (error: any) {
              reject(
                new Error(
                  error?.message ||
                    "Payment succeeded, but confirmation failed.",
                ),
              );
            }
          },
        });
        rzp.open();
      });
    } catch (err: any) {
      if (err.message === "cancelled") setPayState("idle");
      else {
        setPayState("error");
        setErrorMsg(err.message || "Something went wrong. Please try again.");
      }
    }
  };

  if (!open) return null;
  const isLoading = ["submitting", "paying", "verifying"].includes(payState);
  const btnLabel =
    payState === "submitting"
      ? "Saving your details..."
      : payState === "paying"
        ? "Complete payment in popup ->"
        : payState === "verifying"
          ? "Confirming payment..."
          : `Reserve My Spot - Rs ${tierConfig.amount.toLocaleString("en-IN")} ->`;

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setIsRazorpayReady(true)}
        onError={() => setIsRazorpayReady(false)}
      />

      <div
        className="fixed inset-0 z-[800] bg-[#0a0a0a]/95 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-6"
        onClick={(e) => e.target === e.currentTarget && !isLoading && onClose()}
      >
        <div
          className={`bg-[#111] border border-white/[0.07] sm:rounded-2xl rounded-t-2xl p-6 sm:p-10 w-full sm:max-w-[520px] relative max-h-[92vh] overflow-y-auto po-modal-in ${shake ? "po-shake" : ""}`}
        >
          {/* Drag handle on mobile */}
          <div className="w-10 h-1 rounded-full bg-white/10 mx-auto mb-5 sm:hidden" />

          <button
            onClick={() => !isLoading && onClose()}
            disabled={isLoading}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 text-white/20 hover:text-white/55 transition-colors text-[18px] disabled:opacity-20"
          >
            x
          </button>

          <div
            className="inline-flex items-center gap-2 border border-[#E8622A]/25 text-[#E8622A]/65 text-[10px] font-semibold tracking-[2.5px] uppercase px-4 py-[5px] rounded-full mb-4 sm:mb-5"
            style={
              tier === "founding"
                ? {
                    borderColor: "rgba(245,158,11,0.25)",
                    color: "rgba(245,158,11,0.65)",
                  }
                : undefined
            }
          >
            {tierConfig.badgeLabel}
          </div>
          <h3
            className="font-playfair font-normal text-white leading-[1.1] mb-2"
            style={{ fontSize: "clamp(26px, 4vw, 36px)" }}
          >
            Lock in your spot.
          </h3>
          <p className="text-[13px] text-white/30 font-light leading-[1.75] mb-6 sm:mb-8">
            Pay Rs {tierConfig.amount.toLocaleString("en-IN")} now - credited
            towards your collar. Fully refundable.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Your Name *</Label>
              <input
                className={inputCls}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label>Dog's Name *</Label>
              <input
                className={inputCls}
                value={dogsname}
                onChange={(e) => setDogsname(e.target.value)}
                placeholder="e.g. Bruno"
                disabled={isLoading}
              />
            </div>
          </div>

          <Label>Email *</Label>
          <input
            className={inputCls}
            type="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            placeholder="you@email.com"
            disabled={isLoading}
          />

          <Label>Phone *</Label>
          <input
            className={inputCls}
            type="tel"
            value={phoneno}
            onChange={(e) => setPhoneno(e.target.value)}
            placeholder="+91 98765 43210"
            disabled={isLoading}
          />

          <Label>Address *</Label>
          <input
            className={inputCls}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 12B, MG Road"
            disabled={isLoading}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>City *</Label>
              <input
                className={inputCls}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bengaluru"
                disabled={isLoading}
              />
            </div>
            <div ref={stateMenuRef} className="relative">
              <Label>State</Label>
              <button
                type="button"
                onClick={() => {
                  if (isLoading) return;
                  setIsStateMenuOpen((v) => {
                    const next = !v;
                    if (next) setStateQuery("");
                    return next;
                  });
                }}
                disabled={isLoading}
                className={`${inputCls} cursor-pointer text-left flex items-center justify-between ${isStateMenuOpen ? "border-[#E8622A]/50" : ""}`}
              >
                <span className={stateName ? "text-white" : "text-white/25"}>
                  {stateName || "Select state"}
                </span>
                <svg
                  viewBox="0 0 20 20"
                  className={`w-4 h-4 text-white/45 transition-transform ${isStateMenuOpen ? "rotate-180" : ""}`}
                  fill="none"
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {isStateMenuOpen && (
                <div className="absolute z-30 top-full left-0 right-0 mt-1 rounded-xl border border-white/[0.1] bg-[#101010] shadow-[0_18px_40px_rgba(0,0,0,0.45)] max-h-56 overflow-y-auto">
                  <div className="p-2 border-b border-white/[0.06] sticky top-0 bg-[#101010]">
                    <input
                      type="text"
                      value={stateQuery}
                      onChange={(e) => setStateQuery(e.target.value)}
                      placeholder="Search state..."
                      className="w-full bg-[#0b0b0b] border border-white/[0.08] rounded-lg text-white text-[12px] px-3 py-2 outline-none focus:border-[#E8622A]/50 placeholder:text-white/30"
                    />
                  </div>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-3 text-[13px] text-white/65 hover:bg-white/[0.04] border-b border-white/[0.06]"
                    onClick={() => {
                      setStateName("");
                      setIsStateMenuOpen(false);
                    }}
                  >
                    Select state
                  </button>
                  {filteredStates.length === 0 ? (
                    <p className="px-4 py-3 text-[12px] text-white/40">
                      No state found
                    </p>
                  ) : (
                    filteredStates.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`w-full text-left px-4 py-3 text-[13px] hover:bg-white/[0.04] ${
                          s === stateName
                            ? "text-[#E8622A] bg-[#E8622A]/[0.06]"
                            : "text-white/80"
                        }`}
                        onClick={() => {
                          setStateName(s);
                          setStateQuery(s);
                          setIsStateMenuOpen(false);
                        }}
                      >
                        {s}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <Label>How did you hear about us?</Label>
          <select
            className={inputCls + " cursor-pointer"}
            value={source}
            onChange={(e) => setSource(e.target.value)}
            disabled={isLoading}
          >
            {REFERRAL_SOURCES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <Label>Dog's Photo * (JPG / PNG / WEBP | Max 5MB)</Label>
          <div
            onClick={() => !isLoading && fileRef.current?.click()}
            className={`mb-5 rounded-xl border-2 border-dashed transition-colors cursor-pointer ${dogPhoto ? "border-[#E8622A]/40 bg-[#E8622A]/[0.03]" : "border-white/[0.06] hover:border-white/15"}`}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePhoto}
              disabled={isLoading}
            />
            {photoPreview ? (
              <div className="flex items-center gap-4 p-4">
                <img
                  src={photoPreview}
                  alt="Dog preview"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-light text-white/60 truncate">
                    {dogPhoto?.name}
                  </p>
                  <p className="text-[11px] text-white/20 mt-1">
                    {((dogPhoto?.size ?? 0) / 1024).toFixed(0)} KB | Tap to
                    change
                  </p>
                </div>
                <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[#E8622A]/40 bg-[#E8622A]/10 px-2.5 py-1 text-[11px] font-semibold text-[#E8622A]">
                  <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none">
                    <path
                      d="M3.5 8.2L6.6 11.2L12.5 5.3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Uploaded
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-7 sm:py-8 gap-2">
                <span className="text-[11px] sm:text-[12px] text-white/25 uppercase tracking-[1px]">
                  Upload
                </span>
                <p className="text-[13px] text-white/25 font-light">
                  Tap to upload your dog's photo
                </p>
                <p className="text-[11px] text-white/15 font-light">
                  Appears on the Founding Pack Wall
                </p>
              </div>
            )}
          </div>

          {/* Referral */}
          <div className="mb-5">
            <label className="flex items-center gap-3 cursor-pointer group w-fit">
              <div
                onClick={() => {
                  if (isLoading) return;
                  setHasReferral((v) => !v);
                  setRefCode("");
                  setRefStatus("idle");
                  latestReferralCodeRef.current = "";
                  if (referralCheckTimeoutRef.current)
                    clearTimeout(referralCheckTimeoutRef.current);
                }}
                className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${hasReferral ? "bg-[#E8622A] border-[#E8622A]" : "bg-transparent border-white/20 group-hover:border-white/40"}`}
              >
                {hasReferral && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span className="text-[13px] text-white/30 font-light group-hover:text-white/50 transition-colors select-none">
                I have a referral code
              </span>
            </label>
            {hasReferral && (
              <div className="mt-3">
                <Label>Referral Code</Label>
                <div className="relative">
                  <input
                    className={
                      inputCls + " pr-10 uppercase tracking-[2px] !mb-0"
                    }
                    style={{
                      borderColor:
                        refStatus === "ok"
                          ? "#4ade80"
                          : refStatus === "err"
                            ? "#f87171"
                            : undefined,
                    }}
                    value={refCode}
                    onChange={(e) => handleRefCode(e.target.value)}
                    placeholder="e.g. REFA1B2C3D4"
                    maxLength={20}
                    autoFocus
                    disabled={isLoading}
                  />
                  {refStatus !== "idle" && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px]">
                      {refStatus === "checking"
                        ? "..."
                        : refStatus === "ok"
                          ? "OK"
                          : "X"}
                    </span>
                  )}
                </div>
                {refStatus === "ok" && (
                  <p className="text-[12px] text-green-400/60 mt-2 font-light">
                    Code applied.
                  </p>
                )}
                {refStatus === "err" && (
                  <p className="text-[12px] text-red-400/60 mt-2 font-light">
                    Invalid referral code.
                  </p>
                )}
              </div>
            )}
          </div>

          {(payState === "error" || errorMsg) && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/[0.06] border border-red-500/15 text-[13px] text-red-400/70 font-light">
              {errorMsg}
            </div>
          )}

          <button
            onClick={submit}
            disabled={isLoading}
            className="w-full bg-[#E8622A] text-white font-semibold text-[14px] tracking-wide py-[15px] rounded-full transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading && (
              <svg
                className="animate-spin w-4 h-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            )}
            {btnLabel}
          </button>

          <p className="text-[11px] text-white/15 text-center mt-4 leading-[1.7] font-light">
            {tierConfig.footerNote}
          </p>
        </div>
      </div>
    </>
  );
}
