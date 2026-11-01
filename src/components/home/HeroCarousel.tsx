"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, ArrowRight, Sparkles } from "lucide-react";
import { HERO_SLIDES, HeroSlide } from "@/data/slides";
import AmazonLink from "@/components/product/AmazonLink";
import { PRODUCTS } from "@/data/products";
import { useStore } from "@/lib/store";

const ProductViewer = dynamic(() => import("@/components/product/ProductViewer"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full min-h-[320px] flex items-center justify-center text-xs font-bold text-cyber-cyan">
      Loading 3D product...
    </div>
  ),
});

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const mode = useStore((state) => state.mode);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Play the entrance animation only on first mount (not on slide changes)
  const entrancePlayed = useRef(false);
  useEffect(() => {
    entrancePlayed.current = true;
  }, []);

  const totalSlides = HERO_SLIDES.length;
  const currentSlide: HeroSlide = HERO_SLIDES[currentIndex];
  const linkedProduct = PRODUCTS.find((p) => p.slug === currentSlide.productSlug);
  const ctaLink = linkedProduct ? `/product/${linkedProduct.slug}` : "/shop";

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay Timer (8s)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(interval);
  }, [isPaused, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      if (document.activeElement && containerRef.current.contains(document.activeElement)) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          handlePrev();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          handleNext();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Swipe handlers for mobile touch
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  return (
    <section
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Flagship Tech Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="relative hero-full-bleed w-full min-h-[493px] lg:min-h-[450px] bg-cyber-bg overflow-hidden flex items-center outline-none"
    >
      {/* Animated Ambient Particles & Glow Backdrop */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-25 pointer-events-none" />
      
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[140px] pointer-events-none transition-all duration-1000"
        style={{
          backgroundColor: currentSlide.accentColor,
          opacity: 0.15,
        }}
      />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#A855F7]/10 blur-[130px] pointer-events-none" />

      {/* Main Slide Layout — static grid: never remounts, keeps the 3D canvas alive */}
      <div className="relative z-10 w-full px-[30px] py-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Content Column — shifted +200px on desktop, holds the entrance animation */}
          <div className="lg:col-span-7 lg:translate-x-[400px]">
          <motion.div
            initial={
              entrancePlayed.current
                ? false
                : { opacity: 0, y: shouldReduceMotion ? 0 : 120 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
            className="text-left"
          >
            {/* Per-slide text transition (only the cheap DOM content remounts) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-6"
              >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyber-glass border border-cyber-cyan/30 text-cyber-cyan text-xs font-extrabold tracking-wider uppercase backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>{currentSlide.badge}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan" />
                <span>{currentSlide.category}</span>
              </div>

              {/* Headline */}
              <h1 className="font-fairplay font-bold text-4xl sm:text-5xl lg:text-6xl text-zinc-900 leading-[1.1] tracking-tight whitespace-pre-line">
                {currentSlide.headline}
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-zinc-600 max-w-xl leading-relaxed font-normal">
                {currentSlide.subheadline}
              </p>

              {/* Feature Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {currentSlide.specsHighlight.map((spec, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-xl bg-cyber-card/80 border border-zinc-200 text-xs font-semibold text-zinc-700"
                  >
                    ⚡ {spec}
                  </span>
                ))}
              </div>

              {/* CTA Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href={ctaLink}
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-cyber-cyan to-[#A855F7] hover:from-cyber-cyan hover:to-cyber-cyan text-white font-heading font-bold text-base shadow-cyan-glow/40 hover:shadow-cyan-glow transition-all duration-300 hover:scale-[1.02]"
                >
                  <span>{currentSlide.ctaText}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                {mode === "AFFILIATE" && linkedProduct && (
                  <AmazonLink
                    asin={linkedProduct.asin}
                    variant="primary"
                    label="Buy on Amazon"
                    className="py-4 px-6 text-base"
                  />
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
          </div>

            {/* Right 3D Product Showcase — slides in from the left edge of the window on page entry */}
            <motion.div
              initial={
                entrancePlayed.current
                  ? false
                  : { opacity: 0, x: shouldReduceMotion ? 0 : "-100vw" }
              }
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="lg:col-span-5 relative flex items-center justify-center min-h-[272px] sm:min-h-[340px]"
            >
              {/* Radial Neon Backplate */}
              <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-cyber-cyan/20 to-[#A855F7]/20 blur-2xl animate-pulse-glow" />

              <motion.div
                initial={{ scale: 0.9, rotate: -2 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative w-full aspect-square max-w-[490px]"
              >
                <ProductViewer modelUrl={currentSlide.modelUrl ?? "/models/mac_mini.glb"} />
              </motion.div>
            </motion.div>
        </div>
      </div>
    </section>
  );
}
