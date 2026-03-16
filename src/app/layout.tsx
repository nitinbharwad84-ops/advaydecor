import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { createAdminClient } from "@/lib/supabase-admin";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#00b4d8",
};
import "./globals.css";
import ConditionalNavbar from "@/components/layout/ConditionalNavbar";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import { Toaster } from "react-hot-toast";
import { LazyMotion, domAnimation } from "framer-motion";

import Script from 'next/script';

async function getSeoSettings() {
  try {
    const admin = createAdminClient();
    const { data: settings } = await admin.from('seo_settings').select('key, value');
    const config: Record<string, string> = {};
    settings?.forEach(s => { config[s.key] = s.value; });
    return config;
  } catch (error) {
    console.error('Error fetching SEO settings:', error);
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSeoSettings();
  const googleVerification = settings.google_verification || "GVNgZZ_0bSD0QJuRyvEBEbGuNuX1xgZ296vLruj4_JY";

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.advaydecor.in'),
    title: "Advay Decor: Premium Home Decor & Cushion Covers Online India",
    description: "Advay Decor offers artisan cushions, linen covers & designer home decor. Pan-India shipping directly from our Mumbai studio.",
    applicationName: "Advay Decor",
    keywords: [
      "Advay Decor", "AdvayDecor", "Advaya Decor", "Advy Decor", "Advey Decor", "Advay Dekore", "Advaya",
      "home decor online India", "cushion covers online India", "buy cushions online", "luxury cushion covers India",
      "premium cushion covers", "hand-embroidered cushions", "designer cushion covers", "velvet cushion covers Mumbai",
      "artisan home accessories", "embroidered cushion covers", "linen pillow covers India", "modern home decor studio",
      "handmade home decor Mumbai", "sofa cushion sets Mumbai", "high-end home textiles", "living room styling India",
      "bouclé cushions 2026", "artisan wall art cushions", "boutique home decor India", "interior design", "Advay online store",
    ],
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Advay Decor",
    },
    icons: {
      icon: [{ url: "/logo.svg" }, { url: "/logo.svg", type: "image/svg+xml" }],
      shortcut: "/logo.svg",
      apple: "/logo.svg",
    },
    openGraph: {
      title: "Advay Decor: Premium Home Decor & Cushion Covers Online India",
      description: "Advay Decor offers artisan cushions, linen covers & designer home decor. Pan-India shipping directly from our Mumbai studio.",
      type: "website",
      siteName: "Advay Decor",
      images: [{ url: "/logo.svg", width: 800, height: 600, alt: "Advay Decor Logo" }],
    },
    verification: {
      google: googleVerification,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSeoSettings();

  const ga4Id = settings.ga4_measurement_id || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const gtagId = settings.google_tag_id || "AW-17990232628";
  const pixelId = settings.meta_pixel_id || process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const gtmId = settings.google_tag_manager_id;

  // Primary ID for loading the script
  const primaryTrackingId = ga4Id || gtagId;

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://awkaeeteelujitzgwzfr.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://awkaeeteelujitzgwzfr.supabase.co" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Advay Decor",
              "alternateName": ["AdvayDecor", "Advaya Decor"],
              "url": "https://www.advaydecor.in"
            }),
          }}
        />
        {/* Google Tag Manager */}
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`
            }}
          />
        )}
        {/* End Google Tag Manager */}
      </head>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {/* End Google Tag Manager (noscript) */}
        {/* Unified Tracking Scripts */}
        {primaryTrackingId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${primaryTrackingId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                ${ga4Id ? `gtag('config', '${ga4Id}');` : ''}
                ${gtagId ? `gtag('config', '${gtagId}');` : ''}
              `}
            </Script>
          </>
        )}

        {pixelId && (
          <Script id="meta-pixel" strategy="lazyOnload">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${pixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}

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
        <LazyMotion features={domAnimation} strict>
          <ConditionalNavbar />
          <main className="flex-1">
            {children}
          </main>
          <ConditionalFooter />
        </LazyMotion>
      </body>
    </html>
  );
}
