"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "@/data/products";
import { formatCurrency, calculateDiscountPercentage } from "@/lib/utils";
import StarRating from "@/components/ui/StarRating";
import AmazonLink from "@/components/product/AmazonLink";
import { useStore } from "@/lib/store";
import { Zap, Clock, ShoppingCart } from "lucide-react";

export default function DealOfDay() {
  const dealProduct = PRODUCTS.find((p) => p.isDealOfDay) || PRODUCTS[0];
  const mode = useStore((state) => state.mode);
  const addToCart = useStore((state) => state.addToCart);

  // Live Timer State (Countdown to midnight)
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 42,
    seconds: 18,
    millis: 90,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds, millis } = prev;
        millis -= 10;
        if (millis < 0) {
          millis = 99;
          seconds -= 1;
        }
        if (seconds < 0) {
          seconds = 59;
          minutes -= 1;
        }
        if (minutes < 0) {
          minutes = 59;
          hours -= 1;
        }
        if (hours < 0) {
          hours = 23;
        }
        return { hours, minutes, seconds, millis };
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const discount = dealProduct.originalPrice
    ? calculateDiscountPercentage(dealProduct.originalPrice, dealProduct.price)
    : 0;

  return (
    <section className="py-16 bg-gradient-to-b from-cyber-bg to-cyber-darker relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-cyber-pink/10 blur-[150px] pointer-events-none" />

      <div className="w-full px-[30px]">
        <div className="rounded-3xl bg-cyber-glass border border-cyber-pink/30 p-8 lg:p-12 shadow-pink-glow/10 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyber-pink/20 border border-cyber-pink/40 text-cyber-pink text-xs font-black uppercase tracking-widest">
                <Zap className="w-4 h-4 fill-cyber-pink" />
                <span>LIMITED TIME DEAL OF THE DAY</span>
              </div>

              <h2 className="font-heading font-black text-3xl sm:text-4xl text-zinc-900">
                {dealProduct.name}
              </h2>

              <StarRating rating={dealProduct.rating} count={dealProduct.reviewCount} size="md" />

              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                {dealProduct.shortDescription}
              </p>

              {/* Price & Discount */}
              <div className="flex items-baseline gap-4">
                <span className="font-heading font-black text-3xl sm:text-4xl text-zinc-900">
                  {formatCurrency(dealProduct.price)}
                </span>
                {dealProduct.originalPrice && (
                  <span className="text-base text-zinc-400 line-through">
                    {formatCurrency(dealProduct.originalPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="px-3 py-1 rounded-xl bg-cyber-pink text-black font-black text-xs">
                    SAVE {discount}%
                  </span>
                )}
              </div>

              {/* Countdown Clock Display */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-cyber-muted uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-cyber-cyan" />
                  <span>Offer Expires In:</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center p-3 rounded-2xl bg-cyber-card border border-zinc-200 min-w-[70px]">
                    <span className="font-heading font-black text-2xl text-cyber-cyan">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] font-bold text-cyber-muted uppercase">Hours</span>
                  </div>
                  <span className="font-heading font-black text-xl text-zinc-400">:</span>
                  <div className="flex flex-col items-center p-3 rounded-2xl bg-cyber-card border border-zinc-200 min-w-[70px]">
                    <span className="font-heading font-black text-2xl text-cyber-cyan">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] font-bold text-cyber-muted uppercase">Mins</span>
                  </div>
                  <span className="font-heading font-black text-xl text-zinc-400">:</span>
                  <div className="flex flex-col items-center p-3 rounded-2xl bg-cyber-card border border-zinc-200 min-w-[70px]">
                    <span className="font-heading font-black text-2xl text-cyber-pink">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] font-bold text-cyber-muted uppercase">Secs</span>
                  </div>
                  <span className="font-heading font-black text-xl text-zinc-400">:</span>
                  <div className="flex flex-col items-center p-3 rounded-2xl bg-cyber-card border border-zinc-200 min-w-[70px]">
                    <span className="font-heading font-black text-2xl text-amber-600 dark:text-amber-400">
                      {String(timeLeft.millis).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] font-bold text-cyber-muted uppercase">MS</span>
                  </div>
                </div>
              </div>

              {/* Stock Progress Bar */}
              <div className="space-y-1.5 max-w-md">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-600">Available Stock:</span>
                  <span className="text-cyber-pink font-bold">Only {dealProduct.stockCount} left!</span>
                </div>
                <div className="h-2.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
                  <div
                    className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-violet to-cyber-pink rounded-full"
                    style={{ width: "25%" }}
                  />
                </div>
              </div>

              {/* CTA */}
              <div className="pt-2 flex flex-wrap gap-4">
                {mode === "STORE" ? (
                  <button
                    onClick={() => addToCart(dealProduct)}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyber-cyan to-cyber-violet hover:from-cyber-cyan hover:to-cyber-cyan text-white font-heading font-bold text-base shadow-cyan-glow/40 transition-all hover:scale-105"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Claim Deal Now</span>
                  </button>
                ) : (
                  <AmazonLink
                    asin={dealProduct.asin}
                    variant="primary"
                    label="Claim Deal on Amazon"
                    className="py-4 px-8 text-base"
                  />
                )}

                <Link
                  href={`/product/${dealProduct.slug}`}
                  className="px-6 py-4 rounded-2xl bg-zinc-100 border border-zinc-200 text-zinc-600 hover:text-zinc-900 font-bold text-sm"
                >
                  View Details
                </Link>
              </div>
            </div>

            {/* Right Product Image */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full aspect-square max-w-sm rounded-3xl bg-cyber-card/60 p-8 border border-zinc-200 flex items-center justify-center">
                <Image
                  src={dealProduct.images[0]}
                  alt={dealProduct.name}
                  fill
                  className="object-contain p-6 hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
