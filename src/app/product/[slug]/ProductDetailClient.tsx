"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";
import ImageGallery from "@/components/product/ImageGallery";
import ProductTabs from "@/components/product/ProductTabs";
import ProductCard from "@/components/product/ProductCard";
import StarRating from "@/components/ui/StarRating";
import AmazonLink from "@/components/product/AmazonLink";
import { formatCurrency, calculateDiscountPercentage } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { Heart, ShoppingCart, ShieldCheck, Truck, RotateCcw, Plus, Minus, ArrowLeft } from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors?.[0] || ""
  );

  const mode = useStore((state) => state.mode);
  const addToCart = useStore((state) => state.addToCart);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const isWishlisted = useStore((state) => state.isWishlisted(product.id));

  const discount = product.originalPrice
    ? calculateDiscountPercentage(product.originalPrice, product.price)
    : 0;

  return (
    <>
      <div className="py-12 bg-cyber-bg min-h-screen">
        <div className="w-full px-[30px]">
          {/* Breadcrumb Navigation */}
          <div className="mb-8 flex items-center gap-2 text-xs font-semibold text-cyber-muted">
            <Link href="/" className="hover:text-cyber-cyan">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-cyber-cyan">Shop</Link>
            <span>/</span>
            <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-cyber-cyan">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-zinc-700 line-clamp-1">{product.name}</span>
          </div>

          {/* Top Main Product Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Image Gallery (5 Cols) */}
            <div className="lg:col-span-6">
              <ImageGallery images={product.images} productName={product.name} />
            </div>

            {/* Right Product Buy Box (6 Cols) */}
            <div className="lg:col-span-6 space-y-6">
              {/* Category & Brand */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-bold uppercase tracking-wider">
                  {product.brand} • {product.category}
                </span>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2.5 rounded-xl border transition-colors flex items-center gap-2 text-xs font-bold ${
                    isWishlisted
                      ? "bg-cyber-pink/20 border-cyber-pink/50 text-cyber-pink"
                      : "bg-zinc-100 border-zinc-200 text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? "fill-cyber-pink" : ""}`} />
                  <span>{isWishlisted ? "Wishlisted" : "Save to Wishlist"}</span>
                </button>
              </div>

              {/* Title */}
              <h1 className="font-heading font-black text-3xl sm:text-4xl text-zinc-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <StarRating rating={product.rating} count={product.reviewCount} size="md" />
                <span className="text-xs font-bold text-cyber-cyan">Verified Flagship</span>
              </div>

              {/* Price Block */}
              <div className="p-4 rounded-2xl bg-cyber-glass border border-cyber-border/60 flex items-baseline gap-4">
                <span className="font-heading font-black text-3xl sm:text-4xl text-zinc-900">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-zinc-400 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="px-2.5 py-1 rounded-lg bg-cyber-pink text-black font-extrabold text-xs">
                    SAVE {discount}%
                  </span>
                )}
              </div>

              {mode === "AFFILIATE" && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs italic">
                  Note: Prices & availability on Amazon are subject to change. As an Amazon Associate, we earn from qualifying purchases.
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-zinc-600 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Color Variants */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-cyber-muted uppercase tracking-wider">
                    Select Color Finish: <strong className="text-zinc-900">{selectedColor}</strong>
                  </span>
                  <div className="flex items-center gap-3">
                    {product.colors.map((col) => (
                      <button
                        key={col}
                        onClick={() => setSelectedColor(col)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                          selectedColor === col
                            ? "bg-cyber-cyan text-white border-cyber-cyan shadow-cyan-glow"
                            : "bg-zinc-100 border-zinc-200 text-zinc-600 hover:border-zinc-400"
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & CTA */}
              <div className="space-y-4 pt-2">
                {mode === "STORE" ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center rounded-xl bg-zinc-100 border border-zinc-200 p-1.5 gap-3 w-full sm:w-auto justify-center">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="p-1.5 text-zinc-500 hover:text-zinc-900"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-heading font-bold text-base text-zinc-900 px-2">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="p-1.5 text-zinc-500 hover:text-zinc-900"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => addToCart(product, quantity, selectedColor)}
                      className="w-full flex-1 flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-gradient-to-r from-cyber-cyan to-orange-600 hover:from-cyber-cyan hover:to-cyber-cyan text-white font-heading font-bold text-base shadow-cyan-glow/40 transition-all hover:scale-[1.02]"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart ({formatCurrency(product.price * quantity)})</span>
                    </button>
                  </div>
                ) : (
                  <AmazonLink
                    asin={product.asin}
                    variant="primary"
                    label="Buy Now on Amazon"
                    className="w-full py-4 text-base"
                  />
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-200 text-center">
                <div className="p-3 rounded-xl bg-cyber-card/60 border border-zinc-200">
                  <ShieldCheck className="w-5 h-5 text-cyber-cyan mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-zinc-600 block">2-Yr Warranty</span>
                </div>
                <div className="p-3 rounded-xl bg-cyber-card/60 border border-zinc-200">
                  <Truck className="w-5 h-5 text-cyber-violet mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-zinc-600 block">Free Express</span>
                </div>
                <div className="p-3 rounded-xl bg-cyber-card/60 border border-zinc-200">
                  <RotateCcw className="w-5 h-5 text-cyber-pink mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-zinc-600 block">30-Day Return</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Tabs Component */}
          <ProductTabs product={product} />

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-20 space-y-8">
              <h2 className="font-heading font-black text-2xl text-zinc-900">
                Related Flagship Hardware
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {relatedProducts.map((rel) => (
                  <ProductCard key={rel.id} product={rel} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
