"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { type Product } from "@/data/products";
import { useStore } from "@/lib/store";

interface FeaturedProductCardProps {
  product: Product;
  priority?: boolean;
}

function mainTitle(name: string): string {
  const head = name.split(/[,:]/)[0].trim();
  const words = head.split(/\s+/);
  return words.length > 10 ? words.slice(0, 10).join(" ") + "…" : head;
}

export default function FeaturedProductCard({
  product,
  priority = false,
}: FeaturedProductCardProps) {
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const wishlisted = useStore((s) => s.isWishlisted(product.id));

  return (
    <article className="group relative flex aspect-[3/4] flex-col overflow-hidden rounded-2xl border border-black bg-white shadow-sm">
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

      <Link href={`/product/${product.slug}`} className="block px-4 pt-4 pr-12">
        <h3 className="font-heading text-sm font-bold leading-snug text-zinc-900 line-clamp-2">
          {mainTitle(product.name)}
        </h3>
        <div className="mt-0.5 text-xs font-normal text-zinc-500">
          {product.brand}
        </div>
        <div className="mt-1.5 font-heading text-base font-extrabold text-zinc-900">
          ${product.price.toFixed(2)}
        </div>
      </Link>

      <Link
        href={`/product/${product.slug}`}
        className="relative flex-1 block overflow-hidden"
      >
        <Image
          src={product.images[0]}
          alt={`${product.brand} ${product.name}`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 16vw"
          className="object-contain"
        />
      </Link>
    </article>
  );
}