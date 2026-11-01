"use client";

import { useStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
  const isCartOpen = useStore((state) => state.isCartOpen);
  const setCartOpen = useStore((state) => state.setCartOpen);
  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const mode = useStore((state) => state.mode);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-cyber-card/80 backdrop-blur-sm"
          />

          {/* Slide-out Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-cyber-bg/95 backdrop-blur-2xl border-l border-cyber-border/80 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h2 className="font-heading font-bold text-lg text-zinc-900">Your Tech Cart</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyber-cyan/20 text-cyber-cyan">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>

              <button
                onClick={() => setCartOpen(false)}
                className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="p-6 rounded-3xl bg-cyber-card/60 border border-zinc-200 text-zinc-400">
                    <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-zinc-700">Your cart is empty</h3>
                  <p className="text-sm text-cyber-muted max-w-xs">
                    Discover cutting-edge flagship gadgets and add them to your cart.
                  </p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="mt-2 px-6 py-3 rounded-xl bg-cyber-cyan text-white font-bold text-sm shadow-cyan-glow/30 hover:shadow-cyan-glow"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedColor}`}
                    className="flex gap-4 p-3.5 rounded-2xl bg-cyber-card/50 border border-zinc-200 hover:border-zinc-300 transition-colors"
                  >
                    {/* Item Image */}
                    <div className="relative w-20 h-20 rounded-xl bg-cyber-card overflow-hidden shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex flex-col flex-1 min-w-0">
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={() => setCartOpen(false)}
                        className="font-heading font-semibold text-sm text-zinc-700 hover:text-cyber-cyan transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>

                      {item.selectedColor && (
                        <span className="text-[11px] text-cyber-muted mt-0.5">
                          Color: {item.selectedColor}
                        </span>
                      )}

                      <div className="font-heading font-bold text-sm text-zinc-900 mt-1">
                        {formatCurrency(item.product.price)}
                      </div>

                      {/* Quantity & Delete Controls */}
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <div className="flex items-center rounded-lg bg-cyber-card border border-zinc-200 p-1 gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-1 text-zinc-500 hover:text-zinc-900"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-zinc-900 px-1">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="p-1 text-zinc-500 hover:text-zinc-900"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-zinc-200 bg-cyber-card/80 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-cyber-muted">
                    <span>Subtotal</span>
                    <span className="font-bold text-zinc-900">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-cyber-muted">
                    <span>Shipping</span>
                    <span className="text-cyber-cyan font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-zinc-900 pt-2 border-t border-zinc-200">
                    <span>Total</span>
                    <span className="text-cyber-cyan">{formatCurrency(subtotal)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {mode === "STORE" ? (
                    <Link
                      href="/checkout"
                      onClick={() => setCartOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyber-cyan to-orange-600 hover:from-cyber-cyan hover:to-cyber-cyan text-white font-bold text-sm shadow-cyan-glow/30 transition-all hover:scale-[1.02]"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Link
                      href="/cart"
                      onClick={() => setCartOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold text-sm shadow-amber-500/20 transition-all"
                    >
                      <span>View Amazon Cart Links</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}

                  <Link
                    href="/cart"
                    onClick={() => setCartOpen(false)}
                    className="block text-center text-xs text-cyber-muted hover:text-cyber-cyan py-1 transition-colors"
                  >
                    View Full Cart Page
                  </Link>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
