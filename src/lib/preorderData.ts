// src/lib/preorderData.ts
// All data, types, and constants for the Founding Pack preorder page

export const TOTAL_SLOTS = 20;

export interface Founder {
  name: string;
  pet: string;
  breed: string;
  city: string;
  emoji: string;
  rank: number;
  time: string;
}

export interface PreorderFormData {
  owner: string;
  pet: string;
  email: string;
  phone: string;
  breed: string;
  city: string;
  colour: string;
  source: string;
  rank: number;
}

export const SEED_FOUNDERS: Founder[] = [
  {
    name: "Arjun S.",
    pet: "Bruno",
    breed: "Labrador Retriever",
    city: "Mumbai",
    emoji: "🐕",
    rank: 1,
    time: "3 days ago",
  },
  {
    name: "Meera K.",
    pet: "Mochi",
    breed: "Shih Tzu",
    city: "Bengaluru",
    emoji: "🐩",
    rank: 2,
    time: "2 days ago",
  },
  {
    name: "Rahul P.",
    pet: "Shadow",
    breed: "German Shepherd",
    city: "Hyderabad",
    emoji: "🐕‍🦺",
    rank: 3,
    time: "2 days ago",
  },
  {
    name: "Sneha R.",
    pet: "Cleo",
    breed: "Lhasa Apso",
    city: "Chennai",
    emoji: "🦮",
    rank: 4,
    time: "1 day ago",
  },
  {
    name: "Vikram N.",
    pet: "Rocky",
    breed: "Siberian Husky",
    city: "Pune",
    emoji: "🐺",
    rank: 5,
    time: "23 hrs ago",
  },
  {
    name: "Divya M.",
    pet: "Kitty",
    breed: "Indian Pariah / Indie",
    city: "Jaipur",
    emoji: "🦊",
    rank: 6,
    time: "18 hrs ago",
  },
  {
    name: "Arun T.",
    pet: "Zeus",
    breed: "Doberman",
    city: "Delhi",
    emoji: "🐕",
    rank: 7,
    time: "47 mins ago",
  },
];

export const DOG_BREEDS = [
  "Labrador Retriever",
  "Golden Retriever",
  "German Shepherd",
  "Beagle",
  "Bulldog",
  "Poodle",
  "Rottweiler",
  "Siberian Husky",
  "Doberman",
  "Shih Tzu",
  "Dachshund",
  "Boxer",
  "Great Dane",
  "Cocker Spaniel",
  "Indian Pariah / Indie",
  "Rajapalayam",
  "Mudhol Hound",
  "Kombai",
  "Chippiparai",
  "Spitz",
  "Lhasa Apso",
  "Pomeranian",
  "Maltese",
  "Border Collie",
  "Australian Shepherd",
  "Akita",
  "Chow Chow",
  "Bichon Frise",
  "Havanese",
  "Mixed Breed / Other",
];

export const COLLAR_COLOURS = [
  "Midnight Black",
  "Burnt Orange",
  "Forest Green",
  "Arctic White",
  "Royal Blue",
  "Surprise Me 🎲",
];

export const REFERRAL_SOURCES = [
  "Instagram",
  "Friend / Word of mouth",
  "Google",
  "Twitter / X",
  "Other",
];

export const PET_EMOJIS = ["🐕", "🐩", "🐕‍🦺", "🦮", "🐶"];

export const PERKS = [
  {
    ico: "📍",
    name: "GPS + Geofencing Collar",
    desc: "Real-time tracking every 10s. Instant alerts the moment your dog leaves their safe zone.",
    tag: "Founder: ₹5,000",
  },
  {
    ico: "⭐",
    name: "6 Months Free Subscription",
    desc: "Founding Pack gets first 6 months completely free — zero strings attached.",
    tag: "Worth ₹1,500+",
  },
  {
    ico: "🎨",
    name: "Custom Engraved Collar",
    desc: "Your dog's name laser-engraved. Choose your accent colour. Made for them, not off a shelf.",
    tag: "Exclusive to Pack",
  },
  {
    ico: "🏆",
    name: "Featured on MyPerro.in",
    desc: "Your dog's photo and name live permanently on our Founding Pack Wall. The OGs who made this happen.",
    tag: "Permanent Legacy",
  },
  {
    ico: "🎁",
    name: "Founding Pack Merch Box",
    desc: "Bandana, enamel pin, paw print keychain, and a tote. A real unboxing moment.",
    tag: "Never Again",
  },
  {
    ico: "📲",
    name: "Direct Founder Access",
    desc: "Private WhatsApp group with the MyPerro founders. Your feedback literally shapes what gets built.",
    tag: "Inner Circle",
  },
  {
    ico: "🥇",
    name: "Founding Member Badge",
    desc: "A shareable digital badge for Instagram and WhatsApp. Show the world your dog was first.",
    tag: "Share & Flex",
  },
  {
    ico: "⚡",
    name: "First Access, Forever",
    desc: "Every new feature — Founding Pack gets it first. Plus priority support — skip every queue, forever.",
    tag: "Lifetime Perk",
  },
];

export const FAQS = [
  {
    q: "Is the ₹500 refundable?",
    a: "Absolutely. If MyPerro doesn't ship your collar by the committed deadline, you get a full refund, no questions, no forms, no chasing us. We'd rather lose a customer than lose your trust.",
  },
  {
    q: "When will I receive the collar?",
    a: "We're targeting April 2026. You'll be in constant contact with us, our founder will personally update every Founding Pack member through the private WhatsApp group, every step of the way.",
  },
  {
    q: "What does geo-fencing actually mean?",
    a: "You draw a virtual boundary (like a circle around your home) on the app. The moment your dog steps outside that boundary — gate left open, fence jump, anything, your phone gets an instant alert. No more panic.",
  },
  {
    q: "Can I choose customization details later?",
    a: "Yes. After you secure your spot, we'll send a detailed customization form, name engraving, accent colors, sizing, pet photo for the Wall. Take your time. No rush at all.",
  },
  {
    q: "What's inside the mystery merch box?",
    a: "We're keeping it a surprise, but think premium, curated, and dog parent worthy. It's a founding edition drop and we're putting real care into it. You'll be pleased.",
  },
  {
    q: "What's the subscription cost after 6 free months?",
    a: "₹250–300/month, that's under ₹10/day to always know where your dog is. And as a founding member, we'll honour the best rates for you, always. That's a promise, not a policy.",
  },
];

export const TICKER_ITEMS = [
  "GPS Tracking",
  "Geofencing Alerts",
  "Founder Price ₹5,000",
  "6 Months Free Subscription",
  "Custom Engraved Collar",
  "Featured on MyPerro.in",
  "Founding Pack Merch",
  "Priority Support Forever",
  "Digital Founder Badge",
  "Direct Founder Access",
];

export const PLEDGE_LINES = [
  "We will never sell your pet's data to advertisers, ever",
  "If we don't ship, every rupee is refunded — no questions asked",
  "Founding Pack members keep their perks forever, even post-launch",
  "We will share real updates — delays included. No radio silence",
  "Your pet's safety is the only thing we optimise for",
];
