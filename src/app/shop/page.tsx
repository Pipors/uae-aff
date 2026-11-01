import { Metadata } from "next";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
  title: "Shop Flagship Electronics & Audio Gear",
  description:
    "Browse flagship headphones, smartphones, gaming laptops, cameras, VR headsets and smart home tech — curated for performance, shipped free express.",
  alternates: {
    canonical: "/shop",
  },
};

export default function ShopPage() {
  return <ShopClient />;
}
