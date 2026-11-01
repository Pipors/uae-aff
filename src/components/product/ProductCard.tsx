"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { type Product } from "@/data/products";
import StarRating from "@/components/ui/StarRating";
import { useStore } from "@/lib/store";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const wishlisted = useStore((s) => s.isWishlisted(product.id));

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-black bg-cyber-card shadow-sm">
      {/* Product image — fully visible (contained, white background) */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-white"
      >
        <Image
          src={product.images[0]}
          alt={`${product.brand} ${product.name} — ${product.category}`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
          className="object-contain p-4"
        />
      </Link>

      {/* Wishlist toggle */}
      <button
        type="button"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wishlisted}
        onClick={() => toggleWishlist(product.id)}
        className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition ${
          wishlisted
            ? "border-cyber-cyan/60 bg-cyber-cyan text-white"
            : "border-cyber-border/60 bg-cyber-glass text-cyber-muted hover:border-cyber-cyan/60 hover:text-cyber-cyan"
        }`}
      >
        <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
      </button>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyber-muted">
          {product.brand} • {product.category}
        </span>
        <h3 className="font-heading text-sm font-bold leading-snug text-cyber-text line-clamp-2">
          <Link href={`/product/${product.slug}`}>
            {product.name}
          </Link>
        </h3>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="font-heading text-lg font-extrabold text-cyber-text">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-cyber-muted line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
