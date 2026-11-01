"use client";

import { useEffect, useRef, useState } from "react";
import { PRODUCTS } from "@/data/products";
import FeaturedProductCard from "@/components/home/FeaturedProductCard";
import TabletImageGrid from "@/components/home/TabletImageGrid";
import TimelineRail from "@/components/home/TimelineRail";

const CATEGORIES = [
  "Phones",
  "Smart Watches",
  "Headphones",
  "Laptops",
  "Keyboards",
  "Mice",
  "Camera And Photo",
  "Home Improvement",
  "Televisions",
  "Office Products",
  "Monitors",
  "Tablets",
  "Video Games And Consoles"
];

const GAP = 24;

function PrevArrow() {
  return (
    <svg viewBox="0 0 36 36" className="h-5 w-5">
      <path d="M21.559,12.062 L15.618,17.984 L21.5221,23.944 C22.105,24.533 22.1021,25.482 21.5131,26.065 C21.2211,26.355 20.8391,26.4999987 20.4571,26.4999987 C20.0711,26.4999987 19.6851,26.352 19.3921,26.056 L12.4351,19.034 C11.8531,18.446 11.8551,17.4999987 12.4411,16.916 L19.4411,9.938 C20.0261,9.353 20.9781,9.354 21.5621,9.941 C22.1471,10.528 22.1451,11.478 21.5591,12.062 L21.559,12.062 Z"></path>
    </svg>
  );
}

function NextArrow() {
  return (
    <svg viewBox="0 0 36 36" className="h-5 w-5">
      <path d="M23.5587,16.916 C24.1447,17.4999987 24.1467,18.446 23.5647,19.034 L16.6077,26.056 C16.3147,26.352 15.9287,26.4999987 15.5427,26.4999987 C15.1607,26.4999987 14.7787,26.355 14.4867,26.065 C13.8977,25.482 13.8947,24.533 14.4777,23.944 L20.3818,17.984 L14.4408,12.062 C13.8548,11.478 13.8528,10.5279 14.4378,9.941 C15.0218,9.354 15.9738,9.353 16.5588,9.938 L23.5588,16.916 L23.5587,16.916 Z"></path>
    </svg>
  );
}

function CategoryCarousel({
  category,
  isFirst = false,
  isLast = false,
}: {
  category: string;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  const products = PRODUCTS.filter((p) => p.category === category);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  const cardWidth = () => {
    const el = scrollerRef.current;
    if (!el) return 0;
    const first = el.firstElementChild as HTMLElement | null;
    return (first?.offsetWidth ?? 0) + GAP;
  };

  const slideNext = () => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: cardWidth(), behavior: "smooth" });
  };

  const slidePrev = () => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: -cardWidth(), behavior: "smooth" });
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    // Always start at the beginning — ignore browser scroll restoration.
    el.scrollLeft = 0;
    const update = () => setCanGoBack(el.scrollLeft > 8);
    update();
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, []);

  return (
    <section className="py-10 bg-cyber-bg relative">
      <TimelineRail isFirst={isFirst} isLast={isLast} />
      <div className="w-full px-[30px]">
        <div className="mb-10">
          {/* Grey header bar */}
          <div className="ml-[30px] flex h-16 items-center rounded-xl bg-zinc-200 px-6">
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-zinc-900">
              {category}
            </h2>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-proximity scroll-smooth pb-2 -ml-[46px] pl-[46px] scroll-ps-[46px] lg:-ml-[130px] lg:pl-[130px] lg:scroll-ps-[130px]"
          >
            {products.map((product, idx) => (
              <div
                key={product.id}
                className="w-60 sm:w-64 flex-none snap-start"
              >
                <FeaturedProductCard product={product} priority={idx < 4} />
              </div>
            ))}
          </div>

          {/* Previous button — appears once the carousel has slid right */}
          <button
            type="button"
            aria-label="Previous"
            onClick={slidePrev}
            className={`absolute -left-3 sm:-left-20 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white/80 backdrop-blur-md shadow-lg text-zinc-800 transition-opacity duration-300 ${
              canGoBack
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <span className="fill-current">
              <PrevArrow />
            </span>
          </button>

          {/* Next button — always visible */}
          <button
            type="button"
            aria-label="Next"
            onClick={slideNext}
            className="absolute right-0 sm:-right-5 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white/80 backdrop-blur-md shadow-lg text-zinc-800"
          >
            <span className="fill-current">
              <NextArrow />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default function FeaturedProducts() {
  const splitIndex = CATEGORIES.indexOf("Televisions") + 1;
  const firstGroup = CATEGORIES.slice(0, splitIndex);
  const secondGroup = CATEGORIES.slice(splitIndex);
  return (
    <>
      {firstGroup.map((category, index) => (
        <CategoryCarousel
          key={category}
          category={category}
          isFirst={index === 0}
        />
      ))}
      {/* Rail continues through the bento grid so all header dots stay linked */}
      <div className="relative">
        <TimelineRail showDot={false} />
        <TabletImageGrid />
      </div>
      {secondGroup.map((category, index) => (
        <CategoryCarousel
          key={category}
          category={category}
          isLast={index === secondGroup.length - 1}
        />
      ))}
    </>
  );
}