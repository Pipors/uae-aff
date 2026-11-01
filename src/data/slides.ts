export interface HeroSlide {
  id: string;
  productSlug: string;
  category: string;
  badge: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  accentColor: string;
  specsHighlight: string[];
  /** Optional per-slide 3D model (defaults to /models/mac_mini.glb) */
  modelUrl?: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    productSlug: "nexus-pro-sound-x",
    category: "HEADPHONES",
    badge: "FLAGSHIP RELEASE",
    headline: "Next-Gen Sound.\nZero Wires.",
    subheadline: "Experience 50mm Beryllium acoustic drivers, -45dB Hybrid ANC, and Spatial Cyber 3D audio precision.",
    ctaText: "Shop Headphones",
    ctaLink: "/product/nexus-pro-sound-x",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=90",
    accentColor: "#DC2626",
    specsHighlight: ["40h Battery", "-45dB ANC", "Spatial 3D"]
  },
  {
    id: "slide-ipad",
    productSlug: "apple-ipad-11-a16",
    category: "TABLETS",
    badge: "NEW ARRIVAL",
    headline: "iPad 11-inch.\nA16 Power.",
    subheadline: "Apple iPad 11-inch: A16 chip, Liquid Retina Display, 128GB, Wi-Fi 6, 12MP Front/12MP Back Camera, Touch ID, All-Day Battery Life — Blue.",
    ctaText: "Shop iPad",
    ctaLink: "/shop",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=90",
    accentColor: "#3B82F6",
    specsHighlight: ["A16 Chip", "Liquid Retina 11\"", "All-Day Battery"],
    modelUrl: "/models/ipad_a16.glb"
  },
  {
    id: "slide-2",
    productSlug: "cyberphone-16-pro",
    category: "SMARTPHONES",
    badge: "QUANTUM ERA",
    headline: "Quantum Speed.\nLimitless Power.",
    subheadline: "6.8\" Quantum OLED 144Hz screen, Neural X1 5nm Processor, and 200MP Quad-Lens Optics.",
    ctaText: "Explore CyberPhone",
    ctaLink: "/product/cyberphone-16-pro",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=90",
    accentColor: "#A855F7",
    specsHighlight: ["200MP Camera", "144Hz OLED", "1TB Storage"]
  },
  {
    id: "slide-3",
    productSlug: "aura-watch-ultra-2",
    category: "SMARTWATCHES",
    badge: "TITANIUM EDITION",
    headline: "Precision Intelligence.\nOn Your Wrist.",
    subheadline: "Grade 5 titanium body, dual-frequency GPS tracking, satellite SOS, and 10-day endurance.",
    ctaText: "Discover Aura Watch",
    ctaLink: "/product/aura-watch-ultra-2",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=90",
    accentColor: "#C084FC",
    specsHighlight: ["Grade 5 Titanium", "10-Day Battery", "100m Water Res"]
  }
];
