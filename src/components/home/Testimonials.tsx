"use client";

import { useState } from "react";
import StarRating from "@/components/ui/StarRating";
import { CheckCircle2, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Alex V.",
    role: "Audio Engineer & Creator",
    product: "Nexus Pro Sound X Headphones",
    rating: 5,
    comment: "The spatial audio calibration on the Pro Sound X is mind-blowing. Soundstage is so wide and precise that I use them for master audio monitoring.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Marcus Vance",
    role: "Senior Software Architect",
    product: "Volt Blade 16 Gaming Laptop",
    rating: 5,
    comment: "Compiling massive Rust projects and running local LLMs in parallel without thermal throttling. NEXUS TECH delivered this in 2 days flat.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Elena Rostova",
    role: "Ultra-Marathon Athlete",
    product: "Aura Watch Ultra Titanium",
    rating: 5,
    comment: "The L1+L5 dual band GPS tracked my entire 50-mile trail run through dense mountain forests with zero dropouts. Battery had 65% remaining!",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setIndex((prev) => (prev + 1) % TESTIMONIALS.length);

  const current = TESTIMONIALS[index];

  return (
    <section className="py-20 bg-cyber-bg relative overflow-hidden">
      <div className="w-full px-[30px]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold tracking-widest text-cyber-cyan uppercase">
            COMMUNITY REVIEWS
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-zinc-900 mt-2">
            Trusted by Creators & Power Users
          </h2>
        </div>

        <div className="max-w-4xl mx-auto rounded-3xl bg-cyber-glass border border-cyber-border/60 p-8 sm:p-12 relative shadow-cyan-glow/10">
          <Quote className="absolute top-8 right-8 w-16 h-16 text-cyber-cyan/10 stroke-[1]" />

          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            {/* Avatar */}
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-cyber-cyan shrink-0 shadow-cyan-glow">
              {/* eslint-disable-next-html-element-suppression */}
              <img
                src={current.avatar}
                alt={current.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Testimonial Text */}
            <div className="space-y-3 flex-1 text-center sm:text-left">
              <StarRating rating={current.rating} size="md" />

              <p className="text-base sm:text-lg text-zinc-700 italic font-normal leading-relaxed">
                &ldquo;{current.comment}&rdquo;
              </p>

              <div>
                <div className="font-heading font-bold text-zinc-900 text-base flex items-center justify-center sm:justify-start gap-2">
                  <span>{current.name}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-cyber-cyan font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Buyer
                  </span>
                </div>
                <div className="text-xs text-cyber-muted">
                  {current.role} • <span className="text-zinc-500 font-semibold">{current.product}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav Controls */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-200">
            <div className="text-xs text-cyber-muted font-bold">
              0{index + 1} / 0{TESTIMONIALS.length}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                className="p-2.5 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-600 hover:text-cyber-cyan hover:border-cyber-cyan/40 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="p-2.5 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-600 hover:text-cyber-cyan hover:border-cyber-cyan/40 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
