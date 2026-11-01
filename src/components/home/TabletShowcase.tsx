"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

// Order required by design: 2 - 4 - 5 - 3
const CAROUSEL_IMAGES = [
  { src: "/tablet/tablet-lenovo-2.jpg", alt: "Lenovo tablet — side view" },
  { src: "/tablet/tablet-lenovo-4.jpg", alt: "Lenovo tablet — keyboard view" },
  { src: "/tablet/tablet-lenovo-5.jpg", alt: "Lenovo tablet — back view" },
  { src: "/tablet/tablet-lenovo-3.jpg", alt: "Lenovo tablet — pen view" },
];

const SLIDE_INTERVAL_MS = 7000;

// Rotating phrases: each one appears 4 seconds, flipping upward like a slot reel
const ROTATING_PHRASES = ["LEVEL UP YOUR STUDY", "CIRCLE IT, SEARCH IT", "STAY POWERFUL"];
const PHRASE_INTERVAL_MS = 4000;

export default function TabletShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % CAROUSEL_IMAGES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((current) => (current + 1) % ROTATING_PHRASES.length);
    }, PHRASE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative tablet-adjust py-[0px] overflow-hidden">
      {/* Section-wide animated background: blurred active carousel image + white
          gradient overlay — exactly like row 2's background, now spanning the
          entire section and animating whenever the slide changes. */}
      <div className="absolute inset-0" aria-hidden="true">
        {CAROUSEL_IMAGES.map((image, index) => (
          <Image
            key={`section-bg-${image.src}`}
            src={image.src}
            alt=""
            fill
            sizes="100vw"
            className={`object-cover blur-3xl scale-125 transition-opacity duration-1000 ${
              index === activeIndex ? "opacity-70" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-bg/95 via-cyber-bg/75 to-cyber-bg/45" />
      </div>

      <div className="relative w-full px-[0px]  space-y-0">
        {/* Single row: image | animated texts | carousel — 3 columns on desktop */}
        <div className="relative z-10 w-full min-h-[462px] mx-auto px-[0px] grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] items-center gap-8 lg:gap-0">
          {/* Left: tablet image (transparent PNG) */}
          <div className="relative w-full h-[280px] sm:h-[380px] lg:h-[462px] lg:translate-x-[100px]">
          <motion.div
            className="relative w-full h-full"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Image
              src="/tablet/lenovo-rem.png"
              alt="Lenovo tablet with pen"
              fill
              priority
              quality={100}
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-contain"
            />
          </motion.div>
          </div>

          {/* Center: 3 texts with staggered entrance animations */}
          <div className="space-y-5 px-4 lg:translate-x-[170px]">
            <motion.h2
              className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-zinc-900 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              Lenovo Idea&nbsp;Tab
              <span className="block text-[#A855F7]">College Tablet</span>
            </motion.h2>

            <motion.p
              className="text-xl sm:text-2xl font-semibold text-cyber-muted"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              Touchscreen Display · 90Hz
            </motion.p>

            {/* Rotating phrases with an upward-slide reel animation */}
            <div className="flex items-center gap-3">
              <div
                className="relative h-14 sm:h-16 overflow-hidden"
                style={{ perspective: "400px" }}
              >
                <AnimatePresence mode="wait">
                  <motion.p
                    key={phraseIndex}
                    className="font-heading font-bold text-3xl sm:text-4xl text-zinc-900 whitespace-nowrap"
                    initial={{ opacity: 0, rotateX: 90, y: 40 }}
                    animate={{ opacity: 1, rotateX: 0, y: 0 }}
                    exit={{ opacity: 0, rotateX: -90, y: -40 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    {ROTATING_PHRASES[phraseIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right: auto-sliding carousel. Its background is now the section-wide
              animated backdrop above; images keep mix-blend-multiply so their
              white areas blend into that backdrop. */}
          <div className="relative w-full h-[462px] overflow-hidden lg:-translate-x-[100px]">
            {CAROUSEL_IMAGES.map((image, index) => (
              <Image
                key={image.src}
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className={`object-contain mix-blend-multiply transition-opacity duration-700 ${
                  index === activeIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
