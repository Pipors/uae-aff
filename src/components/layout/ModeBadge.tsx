"use client";

import { useStore } from "@/lib/store";
import { Store, Tag } from "lucide-react";

export default function ModeBadge() {
  const mode = useStore((state) => state.mode);
  const toggleMode = useStore((state) => state.toggleMode);

  return (
    <button
      onClick={toggleMode}
      title="Click to toggle between Store Mode and Amazon Affiliate Link Mode"
      className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
        mode === "STORE"
          ? "bg-cyber-cyan/10 border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan/20"
          : "bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20"
      }`}
    >
      {mode === "STORE" ? (
        <>
          <Store className="w-3.5 h-3.5" />
          <span>STORE MODE</span>
        </>
      ) : (
        <>
          <Tag className="w-3.5 h-3.5" />
          <span>AFFILIATE MODE</span>
        </>
      )}
    </button>
  );
}
