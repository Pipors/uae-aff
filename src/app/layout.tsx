import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import Toast from "@/components/ui/Toast";
import TermsConsentModal from "@/components/ui/TermsConsentModal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nexustech-store.com"),
  title: {
    default: "NEXUS TECH — Flagship Consumer Electronics & Audio",
    template: "%s | NEXUS TECH",
  },
  description:
    "Experience quantum performance electronics: high-fidelity headphones, flagship smartphones, cinema cameras, smart home hubs, and ultra laptops.",
  keywords: [
    "Consumer Electronics",
    "High-End Audio",
    "Spatial Headphones",
    "Flagship Smartphones",
    "Smartwatches",
    "NEXUS TECH",
    "Tech Store",
  ],
  authors: [{ name: "NEXUS TECH Engineering" }],
  openGraph: {
    title: "NEXUS TECH — Flagship Consumer Electronics",
    description: "Apple & Samsung flagship store quality consumer electronics.",
    url: "https://nexustech-store.com",
    siteName: "NEXUS TECH",
    images: [
      {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "NEXUS TECH Flagship Showcase",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXUS TECH — Next-Gen Electronics",
    description: "Quantum sound, high-res optics, and aerospace engineering.",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#F4F4F5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NEXUS TECH",
    url: "https://nexustech-store.com",
    sameAs: [
      "https://twitter.com/nexustech",
      "https://instagram.com/nexustech",
      "https://youtube.com/nexustech",
    ],
  };

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        {/* Site is locked to the light white-gray theme — remove any stale dark preference */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{localStorage.removeItem('nexus-theme');document.documentElement.classList.remove('dark')}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-cyber-bg text-cyber-text antialiased">
        <Navbar />
        <CartDrawer />
        <Toast />
        <TermsConsentModal />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
