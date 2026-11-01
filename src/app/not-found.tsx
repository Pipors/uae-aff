import Link from "next/link";
import { Cpu, Home, Search, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-cyber-bg relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-cyber-cyan/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyber-violet/5 blur-[130px] pointer-events-none" />

      <div className="text-center space-y-8 relative z-10 max-w-lg">
        {/* Glitchy 404 */}
        <div className="relative">
          <h1 className="font-heading font-black text-[120px] sm:text-[160px] leading-none text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-violet to-cyber-pink select-none">
            404
          </h1>
          <div className="absolute inset-0 font-heading font-black text-[120px] sm:text-[160px] leading-none text-cyber-cyan/5 blur-xl select-none" aria-hidden="true">
            404
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-heading font-bold text-2xl text-zinc-900">
            Signal Lost — Page Not Found
          </h2>
          <p className="text-sm text-zinc-600 max-w-sm mx-auto">
            The quantum coordinates you entered don&apos;t match any page in our tech nexus. The page may have been moved, deleted, or never existed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-cyber-cyan text-white font-bold text-sm shadow-cyan-glow/30 hover:scale-105 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Base</span>
          </Link>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-zinc-100 border border-zinc-200 text-zinc-700 font-bold text-sm hover:border-cyber-cyan/40 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Browse Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
