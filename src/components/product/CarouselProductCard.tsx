import Image from "next/image";
import Link from "next/link";

export interface ProductCardProps {
  imageUrl: string;
  imageAlt: string;
  eyebrow?: string;
  title: string;
  description: string;
  price: string;
  href: string;
}

export default function CarouselProductCard({
  imageUrl,
  imageAlt,
  eyebrow,
  title,
  description,
  price,
  href,
}: ProductCardProps) {
  return (
    <article className="h-full w-full">
      <Link
        href={href}
        aria-label={title}
        className="group relative block h-full w-full overflow-hidden rounded-2xl border border-cyber-border/60 bg-cyber-card shadow-lg shadow-black/20"
      >
        {/* Full-card background image (lazy-loaded by default via next/image) */}
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 24vw"
          className="object-cover"
        />

        {/* Dark gradient overlay for text readability */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/5"
        />

        {/* Content anchored to the bottom of the card */}
        <div className="absolute inset-x-0 bottom-0 z-10 space-y-1.5 p-5">
          {eyebrow && (
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-cyber-cyan">
              {eyebrow}
            </span>
          )}
          <h3 className="font-heading text-lg font-bold leading-snug text-white line-clamp-2">
            {title}
          </h3>
          <p className="truncate text-sm text-zinc-300">{description}</p>
          <p className="pt-1 font-heading text-base font-extrabold text-white">
            {price}
          </p>
        </div>
      </Link>
    </article>
  );
}
