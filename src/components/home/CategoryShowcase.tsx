"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PRODUCTS, Product, CATEGORY_NAMES } from "@/data/products";

function resolveCategoryName(product: Product): string {
  if ((CATEGORY_NAMES as readonly string[]).includes(product.category)) {
    return product.category;
  }
  return CATEGORY_NAMES[0];
}

export default function CategoryShowcase() {
  const categories = CATEGORY_NAMES.map((name) => {
    const items = PRODUCTS.filter((product) => resolveCategoryName(product) === name);
    return {
      name,
      count: items.length,
      image: items[0]?.images[0] || "",
    };
  });

  const featuredProducts = useMemo(
    () =>
      [...PRODUCTS]
        .filter((product) => product.images?.[0])
        .sort((a, b) => b.reviewCount - a.reviewCount)
        .slice(0, 5),
    []
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const carouselRef = useRef<HTMLDivElement>(null);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const carouselResumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const carouselPosRef = useRef(0);
  const carouselHalfRef = useRef(0);
  const carouselAutoWriting = useRef(false);

  const pauseCarouselTemporarily = () => {
    setIsCarouselPaused(true);
    if (carouselResumeTimer.current) clearTimeout(carouselResumeTimer.current);
    carouselResumeTimer.current = setTimeout(() => setIsCarouselPaused(false), 1200);
  };

  useEffect(() => {
    if (featuredProducts.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % featuredProducts.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  useEffect(() => {
    const track = carouselRef.current;
    if (!track) return;

    const measure = () => {
      carouselHalfRef.current = track.scrollHeight / 2;
    };

    measure();
    track.scrollTop = 0;
    carouselPosRef.current = 0;

    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [categories.length]);

  useEffect(() => {
    const track = carouselRef.current;
    if (!track) return;

    const onScroll = () => {
      if (carouselAutoWriting.current) {
        carouselAutoWriting.current = false;
        return;
      }

      const half = carouselHalfRef.current;
      if (half > 0) {
        const scrollTop = track.scrollTop;
        if (scrollTop >= half || scrollTop <= 0) {
          const wrapped = ((scrollTop % half) + half) % half;
          carouselAutoWriting.current = true;
          track.scrollTop = wrapped;
        }
      }
      carouselPosRef.current = track.scrollTop;
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const track = carouselRef.current;
    if (!track) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      pauseCarouselTemporarily();

      const half = carouselHalfRef.current || track.scrollHeight / 2;
      let next = track.scrollTop + event.deltaY;
      if (half > 0) {
        next = ((next % half) + half) % half;
      }

      carouselAutoWriting.current = true;
      track.scrollTop = next;
      carouselPosRef.current = next;
    };

    track.addEventListener("wheel", onWheel, { passive: false });
    return () => track.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const track = carouselRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      const half = carouselHalfRef.current;

      if (!isCarouselPaused && half > 0) {
        carouselPosRef.current = (carouselPosRef.current + 0.06 * dt) % half;
        carouselAutoWriting.current = true;
        track.scrollTop = carouselPosRef.current;
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isCarouselPaused]);

  useEffect(() => {
    return () => {
      if (carouselResumeTimer.current) clearTimeout(carouselResumeTimer.current);
    };
  }, []);

  const featuredProduct = featuredProducts[activeIndex] || featuredProducts[0];

  if (!featuredProduct || categories.length === 0) {
    return null;
  }

  const featuredCategory = resolveCategoryName(featuredProduct);

  return (
    <section className="relative py-[70px] overflow-hidden">
      <div className="relative z-10 w-full px-[30px]">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-zinc-900">
              Browse by Category
            </h2>
            <p className="text-sm text-cyber-muted mt-1">
              Explore Amazon Electronics best sellers by department category
            </p>
          </div>

          <Link
            href="/shop"
            className="text-xs font-bold text-cyber-cyan hover:underline flex items-center gap-1"
          >
            View All Categories →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[560px] lg:min-h-[660px]">
          {/* Left side: selected product image */}
          <Link
            href={`/product/${featuredProduct.slug}`}
            className="lg:col-span-5 group relative min-h-[360px] lg:min-h-full rounded-3xl overflow-hidden block"
          >
            {featuredProducts.map((product, index) => (
              <Image
                key={`featured-${product.id}`}
                src={product.images[0]}
                alt={index === activeIndex ? featuredProduct.name : ""}
                fill
                priority={index === 0}
                sizes="(max-width: 1024px) 100vw, 42vw"
                className={`object-cover transition-all duration-700 group-hover:scale-105 ${
                  index === activeIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-[11px] font-extrabold uppercase tracking-widest backdrop-blur-md mb-4">
                Featured Electronics Best Seller
              </div>
              <h3 className="font-heading font-black text-2xl sm:text-3xl leading-tight line-clamp-3">
                {featuredProduct.name}
              </h3>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-white/75 uppercase tracking-wider">
                  {featuredCategory} • {featuredProduct.reviewCount.toLocaleString()} reviews
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-black text-cyber-cyan">
                  View <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* Right side: transparent vertical carousel only, moving upward */}
          <div className="lg:col-span-7 relative min-h-[420px] lg:min-h-full overflow-hidden">
            <div
              ref={carouselRef}
              onMouseEnter={() => setIsCarouselPaused(true)}
              onMouseLeave={() => setIsCarouselPaused(false)}
              onTouchStart={pauseCarouselTemporarily}
              className="absolute inset-0 overflow-y-auto scrollbar-hide select-none"
            >
              <div className="flex flex-col gap-4 py-1">
                {[0, 1].map((copy) => (
                  <div
                    key={copy}
                    className="flex flex-col gap-4"
                    aria-hidden={copy === 1}
                  >
                    {categories.map((category) => (
                      <Link
                        key={`${copy}-${category.name}`}
                        href={`/shop?category=${encodeURIComponent(category.name)}`}
                        tabIndex={copy === 1 ? -1 : 0}
                        className="group relative flex-none h-36 sm:h-40 rounded-2xl overflow-hidden block"
                      >
                        <Image
                          src={category.image || featuredProducts[0]?.images[0] || featuredProduct.images[0]}
                          alt={category.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 45vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-black/10" />
                        <div className="absolute inset-0 p-4 sm:p-5 flex items-center justify-between gap-4">
                          <div>
                            <h3 className="font-heading font-black text-lg sm:text-xl text-white">
                              {category.name}
                            </h3>
                            <span className="text-xs font-semibold text-white/70">
                              {category.count} Products
                            </span>
                          </div>
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 text-white backdrop-blur-md group-hover:bg-cyber-cyan transition-colors">
                            <ArrowUpRight className="w-5 h-5" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
