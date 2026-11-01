"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, X } from "lucide-react";

const STORAGE_KEY = "nexus-tech-terms-consent";

export default function TermsConsentModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const t = setTimeout(() => setOpen(true), 800);
        return () => clearTimeout(t);
      }
    } catch {
      setOpen(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      /* storage unavailable — just close */
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-consent-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-cyber-border/60 bg-white shadow-2xl">
        <button
          type="button"
          aria-label="Close"
          onClick={accept}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-cyber-muted hover:text-cyber-text"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyber-cyan/10 text-cyber-cyan">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <h2
            id="terms-consent-title"
            className="font-heading text-xl font-extrabold text-zinc-900"
          >
            Terms &amp; Affiliate Disclosure
          </h2>

          <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-600">
            <p>
              Welcome to NEXUS TECH. Before continuing, please review and
              accept the following:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                This website contains <strong>affiliate links</strong>.{" "}
                <strong>
                  As an Amazon Associate, we earn from qualifying purchases
                </strong>{" "}
                — at no additional cost to you.
              </li>
              <li>
                All purchases are completed on Amazon.com. We do not process
                payments, handle orders, or ship products.
              </li>
              <li>
                Product prices and availability are indicative and may change
                on Amazon at any time.
              </li>
            </ul>
            <p className="text-xs text-zinc-500">
              By clicking &quot;Accept &amp; Continue&quot;, you acknowledge and
              agree to our{" "}
              <Link
                href="/affiliate-disclosure"
                className="font-semibold text-cyber-cyan underline underline-offset-2"
              >
                Affiliate Disclosure
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="font-semibold text-cyber-cyan underline underline-offset-2"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <button
            type="button"
            onClick={accept}
            className="mt-6 w-full rounded-2xl bg-cyber-cyan px-6 py-3.5 font-heading text-sm font-bold text-white transition-colors hover:bg-cyber-cyan/90"
          >
            Accept &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
}