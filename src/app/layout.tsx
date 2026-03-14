import "./globals.css";
import localFont from "next/font/local";
import type { Metadata } from "next";
import Script from "next/script";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  title: {
    default: "MyPerro - Smart Pet Collar & GPS Tracker",
    template: "%s ",
  },
  description:
    "MyPerro is the smartest way to care for your dog — with GPS tracking, health monitoring, geofencing, and real-time alerts from a smart collar.",
  metadataBase: new URL("https://myperro.in"),
  keywords: [
    "MyPerro",
    "smart dog collar",
    "dog GPS tracker",
    "pet health monitor",
    "geofencing for dogs",
    "dog tracking app",
    "smart pet wearable",
    "pet safety device",
    "IoT for pets",
  ],
  openGraph: {
    title: "MyPerro - Smart Pet Collar & GPS Tracker",
    description:
      "Track and care for your pet in real time. MyPerro offers GPS, health metrics, geofencing, and more.",
    url: "https://myperro.in",
    siteName: "MyPerro",
    images: [
      {
        url: "https://myperro.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "MyPerro GPS Collar Preview",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyPerro - GPS Collar & Health Monitor for Dogs",
    description:
      "Smart collar, safe pets. Track health, location, and more with MyPerro.",
    images: ["https://myperro.in/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const borela = localFont({
  src: [
    {
      path: "../fonts/borela/BORELA.ttf",
      style: "normal",
    },
  ],
  variable: "--borela",
});

const mombay = localFont({
  src: [
    {
      path: "../fonts/mombay/Thorce.ttf",
      style: "normal",
    },
  ],
  variable: "--mombay",
});

const montserrat = localFont({
  src: [
    {
      path: "../fonts/Montserrat/static/Montserrat-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../fonts/Montserrat/static/Montserrat-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../fonts/Montserrat/static/Montserrat-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/Montserrat/static/Montserrat-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Montserrat/static/Montserrat-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/Montserrat/static/Montserrat-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/Montserrat/static/Montserrat-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/Montserrat/static/Montserrat-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../fonts/Montserrat/static/Montserrat-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../fonts/Montserrat/static/Montserrat-ThinItalic.ttf",
      weight: "100",
      style: "italic",
    },
    {
      path: "../fonts/Montserrat/static/Montserrat-ExtraLightItalic.ttf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../fonts/Montserrat/static/Montserrat-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../fonts/Montserrat/static/Montserrat-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/Montserrat/static/Montserrat-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../fonts/Montserrat/static/Montserrat-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../fonts/Montserrat/static/Montserrat-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../fonts/Montserrat/static/Montserrat-ExtraBoldItalic.ttf",
      weight: "800",
      style: "italic",
    },
    {
      path: "../fonts/Montserrat/static/Montserrat-BlackItalic.ttf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--montserrat",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${borela.variable} ${montserrat.variable} ${mombay.variable}`}
    >
      <body className="bg-foreground antialiased w-full">
        {children}
        {GA_MEASUREMENT_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
