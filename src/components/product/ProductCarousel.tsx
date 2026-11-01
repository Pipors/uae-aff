"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CarouselProductCard, { type ProductCardProps } from "./CarouselProductCard";

const GAP_PX = 16; // matches gap-4 on the track

interface ProductCarouselProps {
  products: ProductCardProps[];
  title?: string;
}

export default function ProductCarousel({ products, title }: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const getStep = useCallback(() => {
    const card = trackRef.current?.querySelector<HTMLElement>("[data-card]");
    return card ? card.offsetWidth + GAP_PX : 0;
  }, []);

  const updateState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    const step = getStep();
    if (step > 0) setActiveIndex(Math.round(el.scrollLeft / step));
  }, [getStep]);

  useEffect(() => {
    updateState();
    window.addEventListener("resize", updateState);
    return () => window.removeEventListener("resize", updateState);
  }, [updateState]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    const step = getStep();
    if (!el || step === 0) return;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const scrollToCard = (index: number) => {
    const el = trackRef.current;
    const step = getStep();
    if (!el || step === 0) return;
    el.scrollTo({ left: index * step, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section aria-label={title ?? "Product carousel"} className="relative w-full">
      {title && (
        <h2 className="mb-6 font-heading text-2xl font-extrabold text-cyber-text sm:text-3xl">
          {title}
        </h2>
      )}

      <div className="relative">
        {/* Scroll track — native scroll + CSS snap, swipe works out of the box */}
        <div
          ref={trackRef}
          onScroll={updateState}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <div
              key={product.href}
              data-card
              className="h-[380px] w-[80%] shrink-0 snap-start sm:h-[400px] sm:w-[40%] lg:w-[24%]"
            >
              <CarouselProductCard {...product} />
            </div>
          ))}
        </div>

        {/* Arrow controls — desktop only (mobile uses native swipe) */}
        <button
          type="button"
          aria-label="Previous product"
          onClick={() => scrollByCard(-1)}
          disabled={!canPrev}
          className="absolute -left-5 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cyber-border/60 bg-cyber-card/90 text-cyber-text shadow-lg backdrop-blur-md transition hover:border-cyber-cyan/60 hover:text-cyber-cyan disabled:opacity-30 disabled:hover:border-cyber-border/60 disabled:hover:text-cyber-text md:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Next product"
          onClick={() => scrollByCard(1)}
          disabled={!canNext}
          className="absolute -right-5 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cyber-border/60 bg-cyber-card/90 text-cyber-text shadow-lg backdrop-blur-md transition hover:border-cyber-cyan/60 hover:text-cyber-cyan disabled:opacity-30 disabled:hover:border-cyber-border/60 disabled:hover:text-cyber-text md:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Pagination dots */}
      <div className="mt-2 flex items-center justify-center gap-2">
        {products.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to product ${i + 1}`}
            aria-current={i === activeIndex}
            onClick={() => scrollToCard(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-6 bg-cyber-cyan"
                : "w-1.5 bg-cyber-border hover:bg-cyber-cyan/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
