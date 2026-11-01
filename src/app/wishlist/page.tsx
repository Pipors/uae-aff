import { Metadata } from "next";
import WishlistClient from "./WishlistClient";

export const metadata: Metadata = {
  title: "Your Wishlist",
  robots: { index: false, follow: false },
};

export default function WishlistPage() {
  return <WishlistClient />;
}
