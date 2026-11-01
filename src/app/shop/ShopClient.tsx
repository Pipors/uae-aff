"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCTS, Product } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";
import StarRating from "@/components/ui/StarRating";
import { Filter, SlidersHorizontal, Grid, List, RotateCcw, X, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { useStore } from "@/lib/store";
import AmazonLink from "@/components/product/AmazonLink";

const INITIAL_VISIBLE_COUNT = 35;
const AUTO_LOAD_COUNT = 15;
const AUTO_LOAD_LIMIT = INITIAL_VISIBLE_COUNT + AUTO_LOAD_COUNT;
const SHOW_MORE_COUNT = 10;

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("search") || "";

  // State Filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const maxProductPrice = Math.max(
    100,
    ...PRODUCTS.map((product) => Math.ceil(product.price / 50) * 50)
  );
  const [maxPrice, setMaxPrice] = useState<number>(maxProductPrice);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const autoLoadRef = useRef<HTMLDivElement | null>(null);

  const mode = useStore((state) => state.mode);
  const addToCart = useStore((state) => state.addToCart);

  // Available Filter Options
  const categories = Array.from(new Set(PRODUCTS.map((p) => p.category)));
  const brands = Array.from(new Set(PRODUCTS.map((p) => p.brand)));

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(product.category)
      ) {
        return false;
      }
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }
      if (product.price > maxPrice) return false;
      if (product.rating < minRating) return false;
      if (inStockOnly && product.stockCount <= 0) return false;
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.brand.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.category.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest") return b.badge === "NEW" ? -1 : 1;
      return 0; // default featured
    });
  }, [
    selectedCategories,
    selectedBrands,
    maxPrice,
    minRating,
    inStockOnly,
    searchQuery,
    sortBy,
  ]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [filteredProducts]);

  useEffect(() => {
    const target = autoLoadRef.current;
    if (!target || visibleCount >= AUTO_LOAD_LIMIT) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((current) =>
            Math.min(current + AUTO_LOAD_COUNT, AUTO_LOAD_LIMIT, filteredProducts.length)
          );
        }
      },
      { rootMargin: "600px 0px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [filteredProducts.length, visibleCount]);

  const showAutoLoadSentinel =
    visibleCount < AUTO_LOAD_LIMIT && visibleCount < filteredProducts.length;
  const showManualLoadMore =
    visibleCount >= AUTO_LOAD_LIMIT && visibleCount < filteredProducts.length;

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleBrand = (b: string) => {
    setSelectedBrands((prev) =>
      prev.includes(b) ? prev.filter((item) => item !== b) : [...prev, b]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMaxPrice(maxProductPrice);
    setMinRating(0);
    setInStockOnly(false);
    setSearchQuery("");
    setSortBy("featured");
  };

  return (
    <div className="py-12 bg-cyber-bg min-h-screen">
      <div className="w-full px-[30px]">
        {/* Page Title & Breadcrumb */}
        <div className="mb-8 space-y-2">
          <div className="text-xs font-bold text-cyber-cyan uppercase tracking-widest flex items-center gap-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-zinc-900">Shop Electronics</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-zinc-900">
            Flagship Hardware Store Catalog
          </h1>
          <p className="text-sm text-cyber-muted">
            Showing {visibleProducts.length} of {filteredProducts.length} premium high-tech electronic products
          </p>
        </div>

        {/* Toolbar Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-cyber-glass border border-cyber-border/60 mb-8">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/40 text-cyber-cyan text-xs font-bold"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>

            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Filter results..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-cyber-card border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400"
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-cyber-muted" />
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyber-muted shrink-0">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl bg-cyber-card border border-zinc-200 text-xs font-semibold text-zinc-900 focus:outline-none focus:border-cyber-cyan"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-cyber-card p-1 rounded-xl border border-zinc-200">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-cyber-cyan text-white"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
                aria-label="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-cyber-cyan text-white"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block space-y-6 p-6 rounded-3xl bg-cyber-glass border border-cyber-border/60 h-fit">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
              <div className="flex items-center gap-2 font-heading font-bold text-base text-zinc-900">
                <Filter className="w-4 h-4 text-cyber-cyan" />
                <span>Catalog Filters</span>
              </div>
              <button
                onClick={clearAllFilters}
                className="text-xs text-cyber-muted hover:text-cyber-cyan flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-xs text-cyber-cyan uppercase tracking-wider">
                Category
              </h4>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-2 text-xs text-zinc-600 hover:text-zinc-900 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="rounded border-zinc-200 text-cyber-cyan focus:ring-cyber-cyan bg-cyber-card"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="space-y-3 border-t border-zinc-200 pt-4">
              <h4 className="font-heading font-bold text-xs text-cyber-cyan uppercase tracking-wider">
                Brand
              </h4>
              <div className="space-y-2">
                {brands.map((b) => (
                  <label
                    key={b}
                    className="flex items-center gap-2 text-xs text-zinc-600 hover:text-zinc-900 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(b)}
                      onChange={() => toggleBrand(b)}
                      className="rounded border-zinc-200 text-cyber-cyan focus:ring-cyber-cyan bg-cyber-card"
                    />
                    <span>{b}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-3 border-t border-zinc-200 pt-4">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-cyber-cyan uppercase tracking-wider">Max Price</span>
                <span className="text-zinc-900">{formatCurrency(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={100}
                max={maxProductPrice}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-cyber-cyan bg-cyber-card"
              />
            </div>

            {/* Rating Filter */}
            <div className="space-y-3 border-t border-zinc-200 pt-4">
              <h4 className="font-heading font-bold text-xs text-cyber-cyan uppercase tracking-wider">
                Minimum Rating
              </h4>
              <div className="space-y-2">
                {[4.8, 4.5, 4.0].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                      minRating === rating
                        ? "bg-cyber-cyan/20 border border-cyber-cyan/40"
                        : "hover:bg-zinc-100"
                    }`}
                  >
                    <StarRating rating={rating} />
                    <span className="text-cyber-muted font-bold">&amp; Up</span>
                  </button>
                ))}
              </div>
            </div>

            {/* In-Stock Toggle */}
            <div className="border-t border-zinc-200 pt-4">
              <label className="flex items-center justify-between text-xs font-semibold text-zinc-600 cursor-pointer">
                <span>In Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-zinc-200 text-cyber-cyan focus:ring-cyber-cyan bg-cyber-card"
                />
              </label>
            </div>
          </aside>

          {/* Product Grid / List Section */}
          <main className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center rounded-3xl bg-cyber-glass border border-cyber-border/60 p-8 space-y-4">
                <Filter className="w-12 h-12 text-cyber-muted mx-auto" />
                <h3 className="font-heading font-bold text-xl text-zinc-900">No products matched your criteria</h3>
                <p className="text-sm text-cyber-muted max-w-sm mx-auto">
                  Try clearing some filters or adjusting your search query.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 rounded-xl bg-cyber-cyan text-white font-bold text-xs shadow-cyan-glow"
                >
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {visibleProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl bg-cyber-glass border border-cyber-border/60 hover:border-cyber-cyan/50 transition-all"
                  >
                    <div className="relative w-full sm:w-48 aspect-square rounded-xl bg-cyber-card overflow-hidden shrink-0">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="text-[11px] font-bold text-cyber-cyan uppercase">
                          {product.brand} • {product.category}
                        </div>
                        <Link
                          href={`/product/${product.slug}`}
                          className="font-heading font-bold text-lg text-zinc-900 hover:text-cyber-cyan transition-colors"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-zinc-600 mt-1 line-clamp-2">
                          {product.shortDescription}
                        </p>
                      </div>

                      <StarRating rating={product.rating} count={product.reviewCount} />

                      <div className="flex items-center justify-between pt-2 border-t border-zinc-200">
                        <div className="font-heading font-black text-xl text-zinc-900">
                          {formatCurrency(product.price)}
                        </div>

                        {mode === "STORE" ? (
                          <button
                            onClick={() => addToCart(product)}
                            className="px-5 py-2.5 rounded-xl bg-cyber-cyan text-white font-bold text-xs shadow-cyan-glow"
                          >
                            Add to Cart
                          </button>
                        ) : (
                          <AmazonLink asin={product.asin} variant="primary" label="Buy on Amazon" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showAutoLoadSentinel && (
              <div
                ref={autoLoadRef}
                className="py-8 text-center text-xs font-bold uppercase tracking-widest text-cyber-muted"
              >
                Loading more best sellers...
              </div>
            )}

            {showManualLoadMore && (
              <div className="pt-8 text-center space-y-3">
                <button
                  onClick={() =>
                    setVisibleCount((current) =>
                      Math.min(current + SHOW_MORE_COUNT, filteredProducts.length)
                    )
                  }
                  className="px-8 py-4 rounded-2xl bg-cyber-glass border border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan/10 font-heading font-bold text-sm transition-all hover:scale-105 shadow-cyan-glow/10"
                >
                  Show More Products
                </button>
                <p className="text-xs text-cyber-muted font-semibold">
                  Showing {visibleProducts.length} of {filteredProducts.length} products
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-cyber-cyan">Loading Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
