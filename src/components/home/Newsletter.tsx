"use client";

import { useState } from "react";
import { Mail, CheckCircle2, Sparkles } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@") || !email.includes(".")) {
      setStatus("error");
      setErrorMessage("Please enter a valid electronic mail address.");
      return;
    }

    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
    }, 1000);
  };

  return (
    <section className="py-20 bg-cyber-darker relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-gradient-to-r from-cyber-cyan/10 via-cyber-violet/10 to-cyber-pink/10 blur-[120px] pointer-events-none" />

      <div className="w-full px-[30px] relative z-10">
        <div className="max-w-3xl mx-auto rounded-3xl bg-cyber-glass border border-cyber-cyan/30 p-8 sm:p-12 text-center shadow-cyan-glow/10">
          <div className="w-12 h-12 rounded-2xl bg-cyber-cyan/10 text-cyber-cyan mx-auto flex items-center justify-center mb-4">
            <Mail className="w-6 h-6" />
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-4xl text-zinc-900">
            Join the Quantum Tech Circle
          </h2>
          <p className="text-sm text-zinc-600 mt-2 max-w-lg mx-auto">
            Subscribe for exclusive early-access flagship drops, engineering deep dives, and an instant <strong className="text-cyber-cyan">$20 welcome voucher</strong>.
          </p>

          {status === "success" ? (
            <div className="mt-6 p-6 rounded-2xl bg-cyber-cyan/10 border border-cyber-cyan/40 text-cyber-cyan flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8" />
              <div className="font-heading font-bold text-lg text-zinc-900">You&apos;re Officially Subscribed!</div>
              <p className="text-xs text-zinc-600">
                Use code <strong className="text-cyber-cyan text-sm">NEXUS20VIP</strong> at checkout for $20 off your first order.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full">
                  <input
                    type="email"
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-cyber-card border border-zinc-200 text-zinc-900 placeholder-zinc-400 text-sm focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan/50"
                  />
                  <Mail className="absolute left-4 top-4 w-4 h-4 text-cyber-muted" />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyber-cyan to-orange-600 hover:from-cyber-cyan hover:to-cyber-cyan text-white font-heading font-bold text-sm shadow-cyan-glow/30 transition-all hover:scale-105 shrink-0"
                >
                  {status === "loading" ? "Subscribing..." : "Get $20 Off"}
                </button>
              </div>

              {status === "error" && (
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold">{errorMessage}</p>
              )}

              <p className="text-[11px] text-cyber-muted flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-cyber-cyan" /> We respect your inbox privacy. Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
