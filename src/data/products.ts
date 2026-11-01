import cameraAndPhotoJson from "./CAMERA_AND_PHOTO/camera_and_photo.json";
import headphonesJson from "./HEADPHONES/headphones.json";
import homeImprovementJson from "./HOME_IMPROVEMENT/home_improvement.json";
import keyboardsJson from "./KEYBOARDS/keyboards.json";
import laptopsJson from "./LAPTOPS/laptops.json";
import miceJson from "./MICE/mice.json";
import monitorsJson from "./MONITORS/monitors.json";
import officeProductsJson from "./OFFICE_PRODUCTS/office_products.json";
import phonesJson from "./PHONES/last_phones.json";
import smartWatchesJson from "./SMART_WATCHES/last_smart_watches.json";
import tabletsJson from "./TABLETS/tablets.json";
import televisionsJson from "./TELEVISIONS/televisions.json";
import videoGamesAndConsolesJson from "./VIDEO_GAMES_AND_CONSOLES/video_games_and_consoles.json";

export interface ProductSpec {
  name: string;
  value: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: "NEW" | "BEST SELLER" | "-20%" | "LIMITED" | "HOT";
  isDealOfDay?: boolean;
  stockCount: number;
  images: string[];
  shortDescription: string;
  fullDescription: string;
  features: string[];
  specs: ProductSpec[];
  reviews: Review[];
  asin: string;
  originalAsin?: string;
  starsBreakdown?: Record<string, number>;
  colors?: string[];
}

/** Raw shape of the per-category best-seller JSON files in src/data/<CATEGORY>/ */
interface RawCategoryProduct {
  name: string;
  asin?: string;
  position?: number;
  price?: { value: number | null; currency?: string } | null;
  numberOfOffers?: number;
  stars?: number | null;
  reviewsCount?: number | null;
  thumbnailUrl?: string;
}

/** Display names for the category folders in src/data (folder name cleaned up). */
export const CATEGORY_NAMES = [
  "Camera And Photo",
  "Headphones",
  "Home Improvement",
  "Keyboards",
  "Laptops",
  "Mice",
  "Monitors",
  "Office Products",
  "Phones",
  "Smart Watches",
  "Tablets",
  "Televisions",
  "Video Games And Consoles",
] as const;

const CATEGORY_FILES: Array<[string, RawCategoryProduct[]]> = [
  ["Camera And Photo", cameraAndPhotoJson as RawCategoryProduct[]],
  ["Headphones", headphonesJson as RawCategoryProduct[]],
  ["Home Improvement", homeImprovementJson as RawCategoryProduct[]],
  ["Keyboards", keyboardsJson as RawCategoryProduct[]],
  ["Laptops", laptopsJson as RawCategoryProduct[]],
  ["Mice", miceJson as RawCategoryProduct[]],
  ["Monitors", monitorsJson as RawCategoryProduct[]],
  ["Office Products", officeProductsJson as RawCategoryProduct[]],
  ["Phones", phonesJson as RawCategoryProduct[]],
  ["Smart Watches", smartWatchesJson as RawCategoryProduct[]],
  ["Tablets", tabletsJson as RawCategoryProduct[]],
  ["Televisions", televisionsJson as RawCategoryProduct[]],
  ["Video Games And Consoles", videoGamesAndConsolesJson as RawCategoryProduct[]],
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function mapCategoryProducts(
  category: string,
  items: RawCategoryProduct[]
): Product[] {
  return items
    .filter(
      (item) =>
        item.asin &&
        item.thumbnailUrl &&
        typeof item.price?.value === "number" &&
        item.price.value > 0
    )
    .map((item, index) => {
      const asin = item.asin as string;
      const name = item.name.trim();
      return {
        id: `${category}-${asin}`,
        slug: `${slugify(name)}-${asin.toLowerCase()}`,
        name,
        brand: name.split(/\s+/)[0],
        category,
        price: item.price?.value ?? 0,
        rating: item.stars ?? 0,
        reviewCount: item.reviewsCount ?? 0,
        badge:
          (item.position ?? index + 1) <= 3 ? ("BEST SELLER" as const) : undefined,
        stockCount: item.numberOfOffers ?? 10,
        images: [item.thumbnailUrl as string],
        shortDescription: name,
        fullDescription: name,
        features: [],
        specs: [],
        reviews: [],
        asin,
      };
    });
}

function buildCategoryProducts(): Product[] {
  const seen = new Set<string>();
  const products: Product[] = [];
  for (const [category, items] of CATEGORY_FILES) {
    for (const product of mapCategoryProducts(category, items)) {
      if (seen.has(product.asin)) continue;
      seen.add(product.asin);
      products.push(product);
    }
  }
  return products;
}

const CATEGORY_PRODUCTS = buildCategoryProducts();

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    slug: "nexus-pro-sound-x",
    name: "Nexus Pro Sound X Wireless Headphones",
    brand: "NEXUS",
    category: "Headphones",
    price: 299.99,
    originalPrice: 379.99,
    rating: 4.9,
    reviewCount: 428,
    badge: "BEST SELLER",
    isDealOfDay: true,
    stockCount: 8,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "Next-gen Active Noise Cancellation headphones with spatial audio and 40-hour ultra battery life.",
    fullDescription: "Immerse yourself in acoustic perfection with the Nexus Pro Sound X. Featuring custom 50mm beryllium drivers, active hybrid noise cancellation, dual beamforming microphones, and lossless wireless transmission via QuantumLink 5.3 standard.",
    features: [
      "Hybrid Active Noise Cancellation (-45dB Isolation)",
      "50mm Precision Beryllium Drivers for Ultra High-Res Audio",
      "40 Hours Continuous Battery Life with Quick Charge (10m charge = 5h playtime)",
      "Spatial Cyber 3D Audio with Dynamic Head Tracking",
      "Dual AI Beamforming Microphones for Crystal Clear Calls"
    ],
    specs: [
      { name: "Connectivity", value: "Bluetooth 5.3 & 2.4GHz Lossless Dongle" },
      { name: "Driver Size", value: "50mm Beryllium Custom" },
      { name: "Frequency Response", value: "5Hz - 45,000Hz" },
      { name: "Battery Life", value: "Up to 40 hours (ANC On)" },
      { name: "Weight", value: "265g" }
    ],
    reviews: [
      {
        id: "rev-1",
        author: "Alex V.",
        rating: 5,
        date: "2026-08-20",
        comment: "The spatial audio on these is out of this world. Sound stage is wide and ANC blocks out everything.",
        verified: true
      },
      {
        id: "rev-2",
        author: "Samantha K.",
        rating: 5,
        date: "2026-08-15",
        comment: "Insanely comfortable for 8+ hour gaming/work sessions. Battery lasts for days!",
        verified: true
      }
    ],
    asin: "B09XPROSOUND",
    colors: ["Cyber Titanium", "Midnight Blue", "Matte Obsidian"]
  },
  {
    id: "prod-2",
    slug: "cyberphone-16-pro",
    name: "CyberPhone 16 Pro Max 1TB",
    brand: "AURA",
    category: "Smartphones",
    price: 1199.99,
    originalPrice: 1399.99,
    rating: 4.8,
    reviewCount: 612,
    badge: "NEW",
    stockCount: 15,
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "6.8\" Quantum OLED 144Hz display powered by the Neural 5nm Chipset and 200MP Quad-Lens Array.",
    fullDescription: "Engineered for creators and power users. CyberPhone 16 Pro features a forged titanium chassis, quantum dot AMOLED screen with 2500 nits peak brightness, and real-time ray tracing GPU.",
    features: [
      "6.8\" Quantum LTPO OLED Display (1-144Hz Dynamic Refresh)",
      "Neural X1 Ultra Chipset with 16-Core NPU",
      "200MP Main Sensor with 10x Optical Periscope Zoom",
      "Titanium Aerospace Frame & Gorilla Armor Glass",
      "65W Wireless Fast Charge & All-Day Dual Battery"
    ],
    specs: [
      { name: "Display", value: "6.8-inch QHD+ Quantum OLED (3120 x 1440)" },
      { name: "Processor", value: "Neural X1 Ultra 5nm Octa-Core" },
      { name: "RAM & Storage", value: "16GB LPDDR5X + 1TB UFS 4.0" },
      { name: "Camera System", value: "200MP Main + 50MP Ultrawide + 50MP 10x Zoom" },
      { name: "Battery", value: "5400 mAh with 90W Wired / 65W Wireless" }
    ],
    reviews: [
      {
        id: "rev-3",
        author: "Marcus T.",
        rating: 5,
        date: "2026-08-22",
        comment: "Camera zoom quality is ridiculous. Photos look like dedicated DSLR shots.",
        verified: true
      }
    ],
    asin: "B09CYBERPHONE",
    colors: ["Space Black", "Titanium Violet", "Neon Silver"]
  },
  {
    id: "prod-3",
    slug: "aura-watch-ultra-2",
    name: "Aura Watch Ultra Titanium Edition",
    brand: "AURA",
    category: "Smartwatches",
    price: 449.99,
    originalPrice: 499.99,
    rating: 4.9,
    reviewCount: 310,
    badge: "HOT",
    stockCount: 12,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "Ultra-rugged titanium smartwatch with dual-frequency GPS, ECG monitor, and 10-day battery life.",
    fullDescription: "Designed for endurance athletes, outdoor explorers, and tech enthusiasts. Aura Watch Ultra delivers military-grade MIL-STD-810H durability, 100m water resistance, continuous health telemetry, and satellite SOS connectivity.",
    features: [
      "Sapphire Crystal Glass & Grade 5 Titanium Case",
      "L1+L5 Dual-Band Precision GPS for Extreme Tracking",
      "Real-time ECG, SpO2, Heart Rate Variability & Body Temp Sensors",
      "100m Water Resistance & SCUBA Dive Computer Ready",
      "Up to 10 Days Battery Life in Smart Mode"
    ],
    specs: [
      { name: "Case Material", value: "Grade 5 Titanium" },
      { name: "Display", value: "1.95-inch Sapphire AMOLED (3000 nits)" },
      { name: "Water Rating", value: "10 ATM / 100 Meters" },
      { name: "Battery", value: "590 mAh (Up to 10 days)" },
      { name: "Sensors", value: "ECG, SpO2, Accelerometer, Barometer, Altimeter" }
    ],
    reviews: [
      {
        id: "rev-4",
        author: "Elena R.",
        rating: 5,
        date: "2026-08-18",
        comment: "Took this hiking in harsh conditions. GPS tracking was pinpoint accurate and screen is readable under direct sunlight.",
        verified: true
      }
    ],
    asin: "B09AURAWATCH",
    colors: ["Titanium Gray", "Electric Cyan Strap", "Stealth Black"]
  },
  {
    id: "prod-4",
    slug: "volt-blade-16-gaming-laptop",
    name: "Volt Blade 16 Cyber OLED Gaming Laptop",
    brand: "VOLT",
    category: "Laptops",
    price: 2499.99,
    originalPrice: 2899.99,
    rating: 4.9,
    reviewCount: 185,
    badge: "-20%",
    stockCount: 5,
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "Intel Core i9 14th Gen, RTX 4090 16GB, 240Hz 4K Mini-LED Display, 64GB DDR5 RAM.",
    fullDescription: "The pinnacle of mobile performance. Featuring liquid metal cooling, vapor chamber heat spreaders, mechanical per-key RGB keyboard, and THX Spatial audio tuned for high frame rate competitive gaming and 3D rendering.",
    features: [
      "Intel Core i9-14900HX 24-Core CPU",
      "NVIDIA GeForce RTX 4090 16GB GDDR6 (175W TGP)",
      "16\" Dual-Mode 4K 120Hz / FHD 240Hz Mini-LED Display",
      "64GB DDR5 5600MHz RAM + 4TB PCIe Gen4 NVMe SSD",
      "Thunderbolt 4, Wi-Fi 7 & Vapor Chamber Liquid Cooling"
    ],
    specs: [
      { name: "CPU", value: "Intel Core i9-14900HX (24 Cores, up to 5.8GHz)" },
      { name: "GPU", value: "NVIDIA RTX 4090 16GB VRAM" },
      { name: "RAM", value: "64GB DDR5" },
      { name: "Storage", value: "4TB NVMe SSD" },
      { name: "Weight", value: "2.45 kg" }
    ],
    reviews: [
      {
        id: "rev-5",
        author: "Dave M.",
        rating: 5,
        date: "2026-08-10",
        comment: "Monster of a machine. Runs Cyberpunk with full path tracing over 100 FPS flawlessly.",
        verified: true
      }
    ],
    asin: "B09VOLTBLADE",
    colors: ["Anodized Gunmetal", "Cyber Violet RGB"]
  },
  {
    id: "prod-5",
    slug: "nexus-vision-8k-vr-headset",
    name: "Nexus Vision 8K Spatial VR/AR Headset",
    brand: "NEXUS",
    category: "Accessories",
    price: 1499.99,
    originalPrice: 1699.99,
    rating: 4.7,
    reviewCount: 94,
    badge: "NEW",
    stockCount: 6,
    images: [
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "Dual 4K Micro-OLED displays, sub-millimeter eye-tracking, and pass-through spatial computing.",
    fullDescription: "Experience reality redefined. Nexus Vision 8K combines ultra-high-resolution spatial displays with zero-latency full-color passthrough to bring professional 3D design, immersive media, and virtual workspaces to life.",
    features: [
      "Dual 4K Micro-OLED Displays (23 Million Pixels Total)",
      "High-Speed Precision Eye Tracking & Gesture Control",
      "Zero-Latency Full-Color Ultra HD Passthrough",
      "Spatial Audio Pods with Lossless Acoustic Delivery",
      "Magnesium-Carbon Fiber Lightweight Frame"
    ],
    specs: [
      { name: "Resolution", value: "3840 x 2160 per eye (8K Combined)" },
      { name: "Refresh Rate", value: "90Hz / 120Hz" },
      { name: "Field of View", value: "115 degrees" },
      { name: "Chipset", value: "Nexus R1 Spatial Co-Processor" },
      { name: "Weight", value: "485g" }
    ],
    reviews: [
      {
        id: "rev-6",
        author: "Dr. Chen",
        rating: 5,
        date: "2026-08-25",
        comment: "The passthrough clarity is astonishing. I can comfortably work with 5 virtual monitors in mid-air.",
        verified: true
      }
    ],
    asin: "B09NEXUSVR",
    colors: ["Cyber White Glass"]
  },
  {
    id: "prod-6",
    slug: "lumina-home-hub-max",
    name: "Lumina Smart Home Control Hub Max",
    brand: "LUMINA",
    category: "Smart Home",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.6,
    reviewCount: 156,
    badge: "LIMITED",
    stockCount: 20,
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "10.1\" Smart HD touchscreen control panel with Matter support, Thread router, and spatial sensors.",
    fullDescription: "Command your smart residence effortlessly. Lumina Home Hub Max features universal Matter & Zigbee protocol bridges, facial gesture control, ambient room climate optimization, and security camera multi-view.",
    features: [
      "10.1\" HD IPS Touchscreen with Dynamic Ambient Sensor",
      "Universal Matter, Thread, Zigbee & Wi-Fi 6E Hub",
      "AI Privacy Guard with Mechanical Camera & Mic Mute Shutter",
      "Multi-Room High Fidelity Speaker with Bass Radiator",
      "Automated Energy & Climate Management System"
    ],
    specs: [
      { name: "Display", value: "10.1-inch 1920x1200 IPS" },
      { name: "Wireless Protocols", value: "Matter, Thread, Zigbee 3.0, Wi-Fi 6E, Bluetooth 5.3" },
      { name: "Camera", value: "13MP Wide-Angle with Auto-Framing" },
      { name: "Speakers", value: "30W Stereo Pair + Dual Passive Radiators" }
    ],
    reviews: [
      {
        id: "rev-7",
        author: "Jason P.",
        rating: 4,
        date: "2026-08-11",
        comment: "Connected all 40+ smart devices in my home in under 10 minutes. Matter support is flawless.",
        verified: true
      }
    ],
    asin: "B09LUMINAHUB",
    colors: ["Obsidian Slate", "Polar Frost White"]
  },
  {
    id: "prod-7",
    slug: "cybercam-alpha-9",
    name: "CyberCam Alpha 9 8K Cinema Mirrorless",
    brand: "CYBER",
    category: "Cameras",
    price: 3299.99,
    originalPrice: 3599.99,
    rating: 4.9,
    reviewCount: 78,
    badge: "BEST SELLER",
    stockCount: 4,
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "Full-frame 50.1MP BSI CMOS sensor with 8K 60fps RAW internal recording and 5-axis IBIS.",
    fullDescription: "Created for professional cinematographers and hybrid photographers. CyberCam Alpha 9 provides 15+ stops of dynamic range, AI tracking autofocus for subjects, and zero rolling shutter artifacts.",
    features: [
      "50.1MP Full-Frame Back-Illuminated Stacked CMOS Sensor",
      "8K 60p & 4K 120p 10-bit 4:2:2 Internal Video Recording",
      "AI Deep Learning Autofocus (Human, Animal, Vehicle Tracking)",
      "8.5-Stop In-Body 5-Axis Image Stabilization (IBIS)",
      "Dual CFexpress Type A / SD UHS-II Card Slots"
    ],
    specs: [
      { name: "Sensor", value: "50.1MP Full-Frame Stacked CMOS" },
      { name: "ISO Range", value: "50 - 102,400" },
      { name: "Video", value: "8K 60fps RAW, 4K 120fps 10-bit" },
      { name: "Viewfinder", value: "9.44M-dot Quad-XGA OLED" },
      { name: "Weight", value: "737g (Body only)" }
    ],
    reviews: [
      {
        id: "rev-8",
        author: "Rachel S.",
        rating: 5,
        date: "2026-08-05",
        comment: "Replaced my heavy cinema rig. The AF tracking on 8K RAW video never misses focus.",
        verified: true
      }
    ],
    asin: "B09CYBERCAM",
    colors: ["Magnesium Black"]
  },
  {
    id: "prod-8",
    slug: "nexus-dock-thunderbolt-5",
    name: "Nexus CyberDock Thunderbolt 5 Workstation Hub",
    brand: "NEXUS",
    category: "Accessories",
    price: 249.99,
    originalPrice: 299.99,
    rating: 4.8,
    reviewCount: 204,
    badge: "-20%",
    stockCount: 22,
    images: [
      "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "16-in-1 Thunderbolt 5 dock with dual 8K display support and 140W Power Delivery.",
    fullDescription: "Transform your workspace into a high-speed command center. Nexus CyberDock delivers bandwidth up to 120Gbps, 2.5G Ethernet, UHS-II SD card readers, and dual 8K 60Hz monitor outputs.",
    features: [
      "Thunderbolt 5 Speed up to 120Gbps Bandwidth Boost",
      "Dual 8K @ 60Hz or Triple 4K @ 144Hz Display Outputs",
      "140W Host Pass-Through Laptop Charging",
      "2.5 Gigabit Ethernet Port + 10Gbps USB-C/USB-A ports",
      "Crafted from CNC Aluminum Heat Dissipation Body"
    ],
    specs: [
      { name: "Ports", value: "3x TB5, 4x USB-C 10Gbps, 2x USB-A, HDMI 2.1, DP 2.1, 2.5G LAN, Audio" },
      { name: "Power Output", value: "140W PD 3.1" },
      { name: "Dimensions", value: "210 x 85 x 25 mm" }
    ],
    reviews: [
      {
        id: "rev-9",
        author: "David B.",
        rating: 5,
        date: "2026-08-14",
        comment: "Drives dual 4K OLED screens effortlessly without heating up.",
        verified: true
      }
    ],
    asin: "B09CYBERDOCK",
    colors: ["Space Gray CNC"]
  },
  {
    id: "prod-9",
    slug: "quantum-pad-pro-13",
    name: "Quantum Pad Pro 13 Ultra Tablet",
    brand: "AURA",
    category: "Smartphones",
    price: 899.99,
    originalPrice: 999.99,
    rating: 4.7,
    reviewCount: 142,
    badge: "NEW",
    stockCount: 9,
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "13\" Tandem OLED display, 5.1mm ultra-thin body, powered by Neural X1 Pro.",
    fullDescription: "The ultimate digital canvas for artists and executives. Features a groundbreaking Tandem OLED panel delivering unmatched contrast, 1600 nits peak HDR brightness, and magnetic stylus pen docking.",
    features: [
      "13-inch Tandem OLED Ultra Retina XDR Display",
      "Only 5.1mm Ultra-Slim Anodized Aluminum Enclosure",
      "Neural X1 Pro Processor with 12-Core GPU",
      "Quad Speaker Array with Dolby Atmos Spatial Sound",
      "Supports Magnetic Pressure Stylus & Detachable Keyboard"
    ],
    specs: [
      { name: "Screen Size", value: "13.0 inches (2752 x 2064)" },
      { name: "Brightness", value: "1000 nits SDR / 1600 nits HDR Peak" },
      { name: "Thickness", value: "5.1 mm" },
      { name: "Weight", value: "579 g" }
    ],
    reviews: [
      {
        id: "rev-10",
        author: "Chloe M.",
        rating: 5,
        date: "2026-08-21",
        comment: "Display colors are unreal. Perfect for digital illustration and HDR video editing.",
        verified: true
      }
    ],
    asin: "B09QUANTUMPAD",
    colors: ["Silver Titanium", "Space Black"]
  },
  {
    id: "prod-10",
    slug: "lumina-cyber-glow-desk-light",
    name: "Lumina CyberGlow RGB Screenbar & Ambient Light",
    brand: "LUMINA",
    category: "Smart Home",
    price: 119.99,
    originalPrice: 149.99,
    rating: 4.8,
    reviewCount: 230,
    badge: "BEST SELLER",
    stockCount: 18,
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "Zero-glare monitor light bar with rear addressable RGB ambient backlight and wireless dial.",
    fullDescription: "Elevate your setup lighting while reducing eye strain. Lumina CyberGlow projects light downward with asymmetrical optics, casting zero reflection on screen while syncing rear RGB lights to audio or screen colors.",
    features: [
      "Asymmetrical Optical Design for 100% Screen Glare Reduction",
      "Rear Addressable ARGB Ambient Backlight Syncing",
      "Wireless Precision Control Knob with OLED Battery Status",
      "CCT Color Temperature Adjustment (2700K - 6500K)",
      "Smart App Control & Voice Assistant Sync"
    ],
    specs: [
      { name: "CRI", value: "Ra > 95 High Color Rendering" },
      { name: "Power", value: "10W USB Type-C Powered" },
      { name: "Length", value: "450 mm" }
    ],
    reviews: [
      {
        id: "rev-11",
        author: "Kevin L.",
        rating: 5,
        date: "2026-08-19",
        comment: "No glare on my curved screen whatsoever. The wireless dial feels premium.",
        verified: true
      }
    ],
    asin: "B09LUMINAGLOW",
    colors: ["Black Aluminum"]
  },
  {
    id: "prod-11",
    slug: "aura-buds-pro-spatial",
    name: "Aura Buds Pro True Wireless Earbuds",
    brand: "AURA",
    category: "Headphones",
    price: 179.99,
    originalPrice: 219.99,
    rating: 4.6,
    reviewCount: 380,
    badge: "HOT",
    stockCount: 25,
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "Smart Active Noise Cancellation earbuds with transparent passthrough and wireless charging case.",
    fullDescription: "Compact audio dominance. Aura Buds Pro feature dynamic acoustic fit, IPX7 sweat/waterproofing, multi-point device switching, and personalized ear canal calibration.",
    features: [
      "Adaptive ANC automatically adjusts to surrounding noise level",
      "11mm Graphene Coated Dynamic Drivers",
      "IPX7 Water Resistance for Heavy Workouts",
      "Up to 32 Hours Total Playtime with Qi Wireless Charging Case",
      "Multi-Point Seamless Switching Between Laptop & Phone"
    ],
    specs: [
      { name: "Battery Life", value: "8h Earbuds + 24h Charging Case" },
      { name: "Water Rating", value: "IPX7 Waterproof" },
      { name: "Codecs", value: "LDAC, AAC, SBC" }
    ],
    reviews: [
      {
        id: "rev-12",
        author: "Maya G.",
        rating: 4,
        date: "2026-08-17",
        comment: "ANC is great for airplane noise. Case is tiny and fits easily in my pocket.",
        verified: true
      }
    ],
    asin: "B09AURABUDS",
    colors: ["Cyber White", "Matte Black", "Cyan Glow"]
  },
  {
    id: "prod-12",
    slug: "cybercam-pocket-vlog-4k",
    name: "CyberCam Pocket 4K AI Gimbal Camera",
    brand: "CYBER",
    category: "Cameras",
    price: 399.99,
    originalPrice: 459.99,
    rating: 4.7,
    reviewCount: 168,
    badge: "NEW",
    stockCount: 11,
    images: [
      "https://images.unsplash.com/photo-1512790182412-b19e6d61b39a?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "Pocket-sized 3-axis mechanical gimbal camera with 4K 120fps video and AI face tracking.",
    fullDescription: "Capture silky smooth buttery footage on the go. Featuring a 1-inch CMOS sensor, rotatable 2-inch OLED touchscreen, and 3 built-in directional microphones.",
    features: [
      "1-Inch CMOS Sensor for Superior Low-Light Performance",
      "3-Axis Mechanical Gimbal Stabilization",
      "4K @ 120fps High Frame Rate Smooth Video",
      "ActiveTrack 6.0 Face & Object Following",
      "Compact 179g Pocket Form Factor"
    ],
    specs: [
      { name: "Sensor", value: "1-inch CMOS" },
      { name: "Video", value: "4K (3840x2160) up to 120fps" },
      { name: "Display", value: "2.0-inch OLED Rotatable Touchscreen" },
      { name: "Battery", value: "1300 mAh (166 mins recording)" }
    ],
    reviews: [
      {
        id: "rev-13",
        author: "Brian H.",
        rating: 5,
        date: "2026-08-23",
        comment: "Game changer for travel vlogging. The 3-axis gimbal eliminates all footsteps motion.",
        verified: true
      }
    ],
    asin: "B09CYBERPOCKET",
    colors: ["Graphite Gray"]
  }
];

export const PRODUCTS: Product[] =
  CATEGORY_PRODUCTS.length > 0 ? CATEGORY_PRODUCTS : FALLBACK_PRODUCTS;
