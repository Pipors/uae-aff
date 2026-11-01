import React from "react";
import { ShoppingBag, ExternalLink } from "lucide-react";
import { buildAmazonAffiliateUrl } from "@/lib/utils";

interface AmazonLinkProps {
  asin: string;
  className?: string;
  label?: string;
  variant?: "primary" | "outline" | "secondary";
  showIcon?: boolean;
}

export default function AmazonLink({
  asin,
  className = "",
  label = "Check Price on Amazon",
  variant = "primary",
  showIcon = true,
}: AmazonLinkProps) {
  const url = buildAmazonAffiliateUrl(asin);

  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50";
  
  const variants = {
    primary:
      "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 px-5 py-3 text-sm",
    outline:
      "border border-amber-500/40 hover:border-amber-400 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 px-4 py-2 text-xs",
    secondary:
      "bg-cyber-card border border-cyber-border hover:border-amber-400 text-zinc-700 hover:text-amber-600 dark:hover:text-amber-400 px-4 py-2.5 text-sm",
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="sponsored nofollow"
      aria-label={`${label} on Amazon (opens in new tab)`}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {showIcon && <ShoppingBag className="w-4 h-4 shrink-0" />}
      <span>{label}</span>
      <ExternalLink className="w-3.5 h-3.5 opacity-70 shrink-0" />
    </a>
  );
}
