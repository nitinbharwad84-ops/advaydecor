import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#00b4d8",
};
import "./globals.css";
import ConditionalNavbar from "@/components/layout/ConditionalNavbar";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import { Toaster } from "react-hot-toast";

import Script from 'next/script';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://advaydecor.vercel.app'),
  title: "AdvayDecor: Premium Home Decor & Cushion Covers Online India",
  description: "Elevate spaces with artisan cushions, linen covers & designer decor. Pan-India shipping directly from our Mumbai studio.",
  applicationName: "AdvayDecor",
  keywords: [
    "home decor online India",
    "cushion covers online India",
    "buy cushions online",
    "premium cushion covers",
    "artisan home accessories",
    "designer cushion covers",
    "embroidered cushion covers",
    "linen pillow covers India",
    "handmade home decor Mumbai",
    "sofa cushion sets Mumbai",
    "bouclé cushions 2026",
    "artisan wall art cushions",
    "interior design",
    "AdvayDecor",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AdvayDecor",
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: "/logo.svg" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "AdvayDecor: Premium Home Decor & Cushion Covers Online India",
    description: "Elevate spaces with artisan cushions, linen covers & designer decor. Pan-India shipping directly from our Mumbai studio.",
    type: "website",
    siteName: "AdvayDecor",
    images: [
      {
        url: "/logo.svg",
        width: 800,
        height: 600,
        alt: "AdvayDecor Logo",
      },
    ],
  },
  verification: {
    google: "GVNgZZ_0bSD0QJuRyvEBEbGuNuX1xgZ296vLruj4_JY",
  },
};

// Site Name JSON-LD for Google
const SiteNameJsonLd = () => (
  <Script id="sitename-jsonld" type="application/ld+json" strategy="afterInteractive">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Advay Decor",
      "alternateName": ["AdvayDecor", "Advaya Decor"],
      "url": "https://advaydecor.vercel.app"
    })}
  </Script>
);

// PWA Service Worker Registration
const PwaRegistration = () => (
  <Script id="register-sw" strategy="afterInteractive">
    {`
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('/sw.js').then(
            function(registration) {
              console.log('PWA: Service Worker registered successfully');
            },
            function(err) {
              console.log('PWA: Service Worker registration failed: ', err);
            }
          );
        });
      }
    `}
  </Script>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <SiteNameJsonLd />
        {/* ======================= */}
        {/* Google Analytics 4 (GA4) */}
        {/* ======================= */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}

        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}

        {/* ======================= */}
        {/* Google Tag (AW-17990232628) */}
        {/* ======================= */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17990232628"
          strategy="afterInteractive"
        />
        <Script id="google-tag-manual" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17990232628');
          `}
        </Script>

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0a0a23',
              color: '#fff',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: '14px',
            },
          }}
        />
        <PwaRegistration />
        <ConditionalNavbar />
        <main className="flex-1">
          {children}
        </main>
        <ConditionalFooter />
      </body>
    </html>
  );
}
