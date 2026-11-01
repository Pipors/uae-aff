"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import AmazonLink from "@/components/product/AmazonLink";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Tag, CheckCircle2 } from "lucide-react";

export default function CartPage() {
  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const clearCart = useStore((state) => state.clearCart);
  const mode = useStore((state) => state.mode);

  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "NEXUS20VIP" || promoCode.trim().toUpperCase() === "NEXUS2026") {
      setDiscountAmount(20);
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code. Try NEXUS20VIP or NEXUS2026.");
    }
  };

  const finalTotal = Math.max(0, subtotal - discountAmount);

  return (
    <div className="py-12 bg-cyber-bg min-h-screen">
      <div className="w-full px-[30px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-zinc-900">
              Shopping Cart
            </h1>
            <p className="text-sm text-cyber-muted mt-1">
              Review your items and proceed to secure checkout
            </p>
          </div>

          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-2 text-xs font-bold text-cyber-cyan hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-cyber-glass border border-cyber-border/60 p-8 space-y-4 max-w-xl mx-auto">
            <ShoppingBag className="w-16 h-16 text-cyber-muted mx-auto stroke-[1.2]" />
            <h2 className="font-heading font-bold text-2xl text-zinc-900">Your cart is empty</h2>
            <p className="text-sm text-cyber-muted">
              Looks like you haven&apos;t added any flagship tech gear yet.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-cyber-cyan text-white font-bold text-sm shadow-cyan-glow"
            >
              <span>Browse Flagship Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Items Table (8 Cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex justify-between items-center pb-2">
                <span className="text-xs font-bold text-cyber-muted uppercase tracking-wider">
                  Items ({cart.length})
                </span>
                <button
                  onClick={clearCart}
                  className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear Cart
                </button>
              </div>

              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedColor}`}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-cyber-glass border border-cyber-border/60"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-xl bg-cyber-card overflow-hidden shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>

                      <div className="space-y-1">
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="font-heading font-bold text-base text-zinc-900 hover:text-cyber-cyan transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        {item.selectedColor && (
                          <div className="text-xs text-cyber-muted">
                            Color: <span className="text-zinc-600 font-semibold">{item.selectedColor}</span>
                          </div>
                        )}
                        <div className="font-heading font-bold text-sm text-cyber-cyan sm:hidden">
                          {formatCurrency(item.product.price)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-200">
                      {/* Quantity Selector */}
                      <div className="flex items-center rounded-xl bg-cyber-card border border-zinc-200 p-1 gap-3">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-zinc-500 hover:text-zinc-900"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-zinc-900 px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-zinc-500 hover:text-zinc-900"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total price for item */}
                      <div className="font-heading font-extrabold text-base text-zinc-900 hidden sm:block min-w-[90px] text-right">
                        {formatCurrency(item.product.price * item.quantity)}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Summary Card (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-3xl bg-cyber-glass border border-cyber-border/60 space-y-6">
                <h3 className="font-heading font-bold text-lg text-zinc-900 border-b border-zinc-200 pb-4">
                  Order Summary
                </h3>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <label className="text-xs font-bold text-cyber-muted uppercase tracking-wider block">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. NEXUS20VIP"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-cyber-card border border-zinc-200 text-xs text-zinc-900 uppercase focus:border-cyber-cyan"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-zinc-200 text-zinc-900 font-bold text-xs hover:bg-cyber-cyan hover:text-white transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && (
                    <div className="text-xs text-cyber-cyan font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> $20 discount applied!
                    </div>
                  )}
                  {promoError && <div className="text-xs text-red-600 dark:text-red-400 font-semibold">{promoError}</div>}
                </form>

                {/* Cost Breakdown */}
                <div className="space-y-3 pt-4 border-t border-zinc-200 text-sm">
                  <div className="flex justify-between text-cyber-muted">
                    <span>Subtotal</span>
                    <span className="text-zinc-900 font-semibold">{formatCurrency(subtotal)}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-cyber-pink font-semibold">
                      <span>Voucher Discount</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-cyber-muted">
                    <span>Estimated Shipping</span>
                    <span className="text-cyber-cyan font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-cyber-muted">
                    <span>Taxes</span>
                    <span className="text-zinc-900 font-semibold">$0.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-zinc-900 pt-3 border-t border-zinc-200">
                    <span>Total Amount</span>
                    <span className="text-cyber-cyan">{formatCurrency(finalTotal)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                {mode === "STORE" ? (
                  <Link
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-cyber-cyan to-orange-600 hover:from-cyber-cyan hover:to-cyber-cyan text-white font-heading font-bold text-base shadow-cyan-glow/30 transition-all hover:scale-[1.02]"
                  >
                    <span>Proceed to Multi-Step Checkout</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-amber-700 dark:text-amber-300 font-semibold">
                      You are in AFFILIATE MODE. Complete your purchase directly on Amazon:
                    </p>
                    {cart.map((item) => (
                      <AmazonLink
                        key={item.product.id}
                        asin={item.product.asin}
                        label={`Buy ${item.product.brand} on Amazon`}
                        variant="primary"
                        className="w-full text-xs py-3"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
