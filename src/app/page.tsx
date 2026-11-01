import { Metadata } from "next";
import HeroCarousel from "@/components/home/HeroCarousel";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TabletShowcase from "@/components/home/TabletShowcase";
import DealOfDay from "@/components/home/DealOfDay";
import PromoBanner from "@/components/home/PromoBanner";
import TrustStrip from "@/components/home/TrustStrip";
import Testimonials from "@/components/home/Testimonials";
import TabletImageGrid from "@/components/home/TabletImageGrid";

import Newsletter from "@/components/home/Newsletter";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* <PromoBanner /> */}
      <HeroCarousel />
      {/* <TabletShowcase /> */}
      <FeaturedProducts />
      <CategoryShowcase />
      <DealOfDay />
      <TrustStrip />
      <Testimonials />
      <Newsletter />
    </>
  );
}
