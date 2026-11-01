import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function PromoBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-cyber-cyan to-cyber-violet py-4 px-[30px] text-white font-bold text-sm text-center relative overflow-hidden shadow-cyan-glow/20">
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 fill-white animate-pulse" />
          <span>⚡ Mega Launch Special: Free Express Worldwide Shipping on Orders Over $50</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-lg bg-cyber-card text-cyber-cyan text-xs font-black">
            CODE: NEXUS2026
          </span>
          <Link
            href="/shop"
            className="underline hover:text-zinc-900 transition-colors text-xs font-black flex items-center gap-1"
          >
            Shop Deals <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
