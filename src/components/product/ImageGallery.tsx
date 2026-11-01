"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Stage */}
      <div
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        className="relative aspect-square w-full rounded-3xl bg-cyber-glass border border-cyber-border/60 overflow-hidden cursor-crosshair flex items-center justify-center p-8 shadow-cyan-glow/10"
      >
        <Image
          src={images[selectedIndex] || images[0]}
          alt={`${productName} view ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 600px"
          className={`object-contain p-6 transition-transform duration-200 ease-out ${
            isZoomed ? "scale-150" : "scale-100"
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                }
              : undefined
          }
        />

        <div className="absolute bottom-4 right-4 px-3 py-1 rounded-xl bg-cyber-card/80 border border-zinc-200 text-[10px] font-bold text-cyber-cyan pointer-events-none">
          🔍 Hover to Zoom
        </div>
      </div>

      {/* Thumbnail Switcher */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-20 h-20 rounded-2xl bg-cyber-card overflow-hidden border-2 transition-all p-2 shrink-0 ${
                selectedIndex === idx
                  ? "border-cyber-cyan shadow-cyan-glow/30"
                  : "border-zinc-200 hover:border-zinc-400 opacity-70"
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
