import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({ rating, count, size = "sm" }: StarRatingProps) {
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : size === "md" ? "w-4 h-4" : "w-5 h-5";

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFull = star <= Math.floor(rating);
          const isHalf = !isFull && star <= Math.ceil(rating) && rating % 1 >= 0.5;

          return (
            <Star
              key={star}
              className={`${iconSize} ${
                isFull
                  ? "fill-amber-400 text-amber-600 dark:text-amber-400"
                  : isHalf
                  ? "fill-amber-400/50 text-amber-600 dark:text-amber-400"
                  : "text-zinc-400 fill-zinc-300"
              }`}
            />
          );
        })}
      </div>
      <span className="text-xs font-semibold text-zinc-600 ml-1">
        {rating.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className="text-xs text-cyber-muted">({count})</span>
      )}
    </div>
  );
}
