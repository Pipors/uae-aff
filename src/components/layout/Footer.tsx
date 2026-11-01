import Link from "next/link";
import { Cpu, ShieldCheck, Truck, RotateCcw, Headphones, Github, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-cyber-darker text-zinc-500 text-sm">
      {/* Top Banner / Value Proposition */}
      <div className="border-b border-zinc-200 py-10 w-full px-[30px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-cyber-glass border border-cyber-border/40">
          <div className="p-3 rounded-xl bg-cyber-cyan/10 text-cyber-cyan">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="font-heading font-bold text-zinc-900 text-sm">Global Express Delivery</div>
            <div className="text-xs text-cyber-muted">Free shipping on orders over $50</div>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-cyber-glass border border-cyber-border/40">
          <div className="p-3 rounded-xl bg-cyber-violet/10 text-cyber-violet">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="font-heading font-bold text-zinc-900 text-sm">2-Year Cyber Warranty</div>
            <div className="text-xs text-cyber-muted">100% genuine guaranteed original</div>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-cyber-glass border border-cyber-border/40">
          <div className="p-3 rounded-xl bg-cyber-pink/10 text-cyber-pink">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <div className="font-heading font-bold text-zinc-900 text-sm">30-Day Risk Free</div>
            <div className="text-xs text-cyber-muted">Hassle-free return policy</div>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-cyber-glass border border-cyber-border/40">
          <div className="p-3 rounded-xl bg-amber-400/10 text-amber-600 dark:text-amber-400">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <div className="font-heading font-bold text-zinc-900 text-sm">24/7 Tech Support</div>
            <div className="text-xs text-cyber-muted">Dedicated engineering assistance</div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="w-full px-[30px] py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand info */}
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyber-cyan to-cyber-violet flex items-center justify-center text-white">
              <Cpu className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="font-heading font-black text-xl tracking-wider text-zinc-900">
              NEXUS<span className="text-cyber-cyan">.TECH</span>
            </span>
          </Link>
          <p className="text-xs leading-relaxed text-cyber-muted max-w-sm">
            NEXUS TECH is a premier flagship consumer electronics destination built for enthusiasts who demand zero compromises in sound, performance, and quantum design.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <a href="#" className="p-2.5 rounded-xl bg-zinc-100 hover:bg-cyber-cyan/20 hover:text-cyber-cyan text-zinc-500 transition-colors" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="p-2.5 rounded-xl bg-zinc-100 hover:bg-cyber-cyan/20 hover:text-cyber-cyan text-zinc-500 transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="p-2.5 rounded-xl bg-zinc-100 hover:bg-cyber-cyan/20 hover:text-cyber-cyan text-zinc-500 transition-colors" aria-label="YouTube">
              <Youtube className="w-4 h-4" />
            </a>
            <a href="#" className="p-2.5 rounded-xl bg-zinc-100 hover:bg-cyber-cyan/20 hover:text-cyber-cyan text-zinc-500 transition-colors" aria-label="GitHub">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-heading font-bold text-zinc-900 text-sm mb-4 tracking-wider uppercase">Categories</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/shop?category=Headphones" className="hover:text-cyber-cyan transition-colors">Headphones & Spatial Audio</Link></li>
            <li><Link href="/shop?category=Phones" className="hover:text-cyber-cyan transition-colors">Flagship Smartphones</Link></li>
            <li><Link href="/shop?category=Smart%20Watches" className="hover:text-cyber-cyan transition-colors">Smartwatches & Wearables</Link></li>
            <li><Link href="/shop?category=Laptops" className="hover:text-cyber-cyan transition-colors">Cyber Laptops</Link></li>
            <li><Link href="/shop?category=Monitors" className="hover:text-cyber-cyan transition-colors">Monitors</Link></li>
            <li><Link href="/shop?category=Camera%20And%20Photo" className="hover:text-cyber-cyan transition-colors">Cinema Cameras</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-heading font-bold text-zinc-900 text-sm mb-4 tracking-wider uppercase">Navigation & Info</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/shop" className="hover:text-cyber-cyan transition-colors">Store Catalog</Link></li>
            <li><Link href="/cart" className="hover:text-cyber-cyan transition-colors">Shopping Cart</Link></li>
            <li><Link href="/about" className="hover:text-cyber-cyan transition-colors">About Engineering</Link></li>
            <li><Link href="/contact" className="hover:text-cyber-cyan transition-colors">Contact Support</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-cyber-cyan transition-colors">Privacy Policy</Link></li>
            <li><Link href="/affiliate-disclosure" className="hover:text-cyber-cyan transition-colors">Affiliate Disclosure</Link></li>
          </ul>
        </div>

        {/* Disclaimer */}
        <div>
          <h4 className="font-heading font-bold text-zinc-900 text-sm mb-4 tracking-wider uppercase">Amazon Associate</h4>
          <p className="text-xs leading-relaxed text-cyber-muted mb-3">
            As an Amazon Associate, I earn from qualifying purchases. Product prices and availability are accurate as of the date/time indicated and are subject to change.
          </p>
          <Link
            href="/affiliate-disclosure"
            className="inline-block text-xs font-semibold text-cyber-cyan hover:underline"
          >
            Read Full Disclosure Statement →
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-200 py-6 w-full px-[30px] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cyber-muted">
        <div>
          © {new Date().getFullYear()} NEXUS TECH Inc. All rights reserved. Designed with quantum aesthetics.
        </div>

        <div className="flex items-center gap-4">
          <Link href="/privacy-policy" className="hover:text-zinc-900">Privacy</Link>
          <Link href="/affiliate-disclosure" className="hover:text-zinc-900">Affiliate Terms</Link>
          <Link href="/contact" className="hover:text-zinc-900">Support</Link>
        </div>
      </div>
    </footer>
  );
}
