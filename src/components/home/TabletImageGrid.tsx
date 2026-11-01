import Image from "next/image";

interface BentoItem {
  src: string;
  bg?: string;
  span: string; // bento span classes (sm+)
  cover?: boolean; // fill the entire tile (crop) instead of fitting inside
}

const IMAGES: BentoItem[] = [
  // tall product tile (left)
  { src: "/headphones/1h.png", bg: "#F0F1F1", span: "sm:row-span-2" },
  // wide lifestyle tiles (right column pair)
  { src: "/headphones/ah.png", bg: "#F1EFEC", span: "sm:col-span-2", cover: true },
  { src: "/headphones/bh.png", bg: "#EEF1F0", span: "sm:col-span-2", cover: true },
  // wide product tile
  { src: "/headphones/2h.png", bg: "#F0F1F1", span: "sm:col-span-2" },
  // tall product tile (right)
  { src: "/headphones/3h.png", bg: "#F0F1F1", span: "sm:row-span-2" },
  // wide lifestyle tile (left)
  { src: "/headphones/ch.png", span: "sm:col-span-2", cover: true },
];

export default function TabletImageGrid() {
  return (
    <section className="bg-cyber-bg relative overflow-hidden">
      <div className="w-full px-[30px] py-10">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3 sm:auto-rows-[300px]">
          {IMAGES.map(({ src, bg, span, cover }, i) => (
            <div
              key={src}
              className={`relative h-[300px] overflow-hidden rounded-2xl sm:h-auto ${span}`}
              style={bg ? { backgroundColor: bg } : undefined}
            >
              <Image
                src={src}
                alt={`Headphones showcase ${i + 1}`}
                fill
                className={cover ? "object-cover" : "object-contain p-2"}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}