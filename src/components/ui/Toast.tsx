"use client";

import { useStore } from "@/lib/store";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Info, AlertTriangle, X } from "lucide-react";

export default function Toast() {
  const toast = useStore((state) => state.toast);
  const hideToast = useStore((state) => state.hideToast);

  if (!toast) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-cyber-card/90 backdrop-blur-xl border border-cyber-cyan/30 text-zinc-900 shadow-cyan-glow/20 shadow-xl max-w-md"
      >
        {toast.type === "success" && <CheckCircle className="w-5 h-5 text-cyber-cyan shrink-0" />}
        {toast.type === "info" && <Info className="w-5 h-5 text-cyber-violet shrink-0" />}
        {toast.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />}

        <span className="text-sm font-medium text-zinc-800 flex-1">{toast.message}</span>

        <button
          onClick={hideToast}
          className="text-zinc-500 hover:text-zinc-900 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
