"use client";

import Link from "next/link";
import { PRODUCTS } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";
import { useStore } from "@/lib/store";
import { Heart, Trash2, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const wishlist = useStore((state) => state.wishlist);
  const toggleWishlist = useStore((state) => state.toggleWishlist);

  const wishlistProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="py-12 bg-cyber-bg min-h-screen">
      <div className="w-full px-[30px]">
        <div className="mb-8">
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-zinc-900">
            Your Wishlist
          </h1>
          <p className="text-sm text-cyber-muted mt-1">
            {wishlistProducts.length} saved item{wishlistProducts.length !== 1 ? "s" : ""}
          </p>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-cyber-glass border border-cyber-border/60 p-8 space-y-4 max-w-xl mx-auto">
            <Heart className="w-16 h-16 text-cyber-muted mx-auto stroke-[1.2]" />
            <h2 className="font-heading font-bold text-2xl text-zinc-900">Wishlist is empty</h2>
            <p className="text-sm text-cyber-muted">
              Save your favorite flagship products for later.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-cyber-cyan text-white font-bold text-sm shadow-cyan-glow"
            >
              <span>Browse Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => wishlistProducts.forEach((p) => toggleWishlist(p.id))}
                className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {wishlistProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
