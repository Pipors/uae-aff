"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2, CreditCard, MapPin, Package, ArrowRight, ArrowLeft, Lock, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

type CheckoutStep = "shipping" | "payment" | "review" | "confirmation";

export default function CheckoutPage() {
  const cart = useStore((state) => state.cart);
  const clearCart = useStore((state) => state.clearCart);
  const [step, setStep] = useState<CheckoutStep>("shipping");

  // Shipping form
  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });

  // Payment form
  const [payment, setPayment] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const steps: { key: CheckoutStep; label: string; icon: React.ReactNode }[] = [
    { key: "shipping", label: "Shipping", icon: <MapPin className="w-4 h-4" /> },
    { key: "payment", label: "Payment", icon: <CreditCard className="w-4 h-4" /> },
    { key: "review", label: "Review", icon: <Package className="w-4 h-4" /> },
    { key: "confirmation", label: "Confirmed", icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  const stepIndex = steps.findIndex((s) => s.key === step);

  const handlePlaceOrder = () => {
    setStep("confirmation");
    clearCart();
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 },
      colors: ["#DC2626", "#EA580C", "#F59E0B"],
    });
  };

  if (cart.length === 0 && step !== "confirmation") {
    return (
      <div className="py-24 text-center max-w-md mx-auto space-y-4">
        <Package className="w-16 h-16 text-cyber-muted mx-auto" />
        <h1 className="font-heading font-black text-2xl text-zinc-900">Cart is Empty</h1>
        <p className="text-sm text-cyber-muted">Add items to your cart before checking out.</p>
        <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyber-cyan text-white font-bold text-sm">
          Browse Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 bg-cyber-bg min-h-screen">
      <div className="w-full px-[30px]">
        <h1 className="font-heading font-black text-3xl text-zinc-900 mb-8">Secure Checkout</h1>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-10 px-4">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center flex-1 last:flex-initial">
              <div className={`flex items-center gap-2 ${i <= stepIndex ? "text-cyber-cyan" : "text-zinc-400"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                  i < stepIndex ? "bg-cyber-cyan text-white border-cyber-cyan" :
                  i === stepIndex ? "border-cyber-cyan text-cyber-cyan bg-cyber-cyan/10" :
                  "border-zinc-300 text-zinc-400"
                }`}>
                  {i < stepIndex ? <CheckCircle2 className="w-5 h-5" /> : s.icon}
                </div>
                <span className="hidden sm:block text-xs font-bold">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 rounded-full ${i < stepIndex ? "bg-cyber-cyan" : "bg-zinc-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="rounded-3xl bg-cyber-glass border border-cyber-border/60 p-8 sm:p-10">

          {/* SHIPPING STEP */}
          {step === "shipping" && (
            <div className="space-y-6">
              <h2 className="font-heading font-bold text-xl text-zinc-900">Shipping Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-cyber-muted uppercase tracking-wider mb-1.5">First Name</label>
                  <input type="text" value={shipping.firstName} onChange={(e) => setShipping({...shipping, firstName: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-cyber-card border border-zinc-200 text-zinc-900 text-sm focus:border-cyber-cyan focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cyber-muted uppercase tracking-wider mb-1.5">Last Name</label>
                  <input type="text" value={shipping.lastName} onChange={(e) => setShipping({...shipping, lastName: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-cyber-card border border-zinc-200 text-zinc-900 text-sm focus:border-cyber-cyan focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cyber-muted uppercase tracking-wider mb-1.5">Email</label>
                  <input type="email" value={shipping.email} onChange={(e) => setShipping({...shipping, email: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-cyber-card border border-zinc-200 text-zinc-900 text-sm focus:border-cyber-cyan focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cyber-muted uppercase tracking-wider mb-1.5">Phone</label>
                  <input type="tel" value={shipping.phone} onChange={(e) => setShipping({...shipping, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-cyber-card border border-zinc-200 text-zinc-900 text-sm focus:border-cyber-cyan focus:outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-cyber-muted uppercase tracking-wider mb-1.5">Street Address</label>
                  <input type="text" value={shipping.address} onChange={(e) => setShipping({...shipping, address: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-cyber-card border border-zinc-200 text-zinc-900 text-sm focus:border-cyber-cyan focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cyber-muted uppercase tracking-wider mb-1.5">City</label>
                  <input type="text" value={shipping.city} onChange={(e) => setShipping({...shipping, city: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-cyber-card border border-zinc-200 text-zinc-900 text-sm focus:border-cyber-cyan focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cyber-muted uppercase tracking-wider mb-1.5">State / Province</label>
                  <input type="text" value={shipping.state} onChange={(e) => setShipping({...shipping, state: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-cyber-card border border-zinc-200 text-zinc-900 text-sm focus:border-cyber-cyan focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cyber-muted uppercase tracking-wider mb-1.5">ZIP Code</label>
                  <input type="text" value={shipping.zip} onChange={(e) => setShipping({...shipping, zip: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-cyber-card border border-zinc-200 text-zinc-900 text-sm focus:border-cyber-cyan focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cyber-muted uppercase tracking-wider mb-1.5">Country</label>
                  <select value={shipping.country} onChange={(e) => setShipping({...shipping, country: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-cyber-card border border-zinc-200 text-zinc-900 text-sm focus:border-cyber-cyan focus:outline-none">
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Germany</option>
                    <option>France</option>
                    <option>Japan</option>
                    <option>Australia</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button onClick={() => setStep("payment")} className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-cyber-cyan text-white font-bold text-sm shadow-cyan-glow/30 hover:scale-[1.02] transition-all">
                  Continue to Payment <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* PAYMENT STEP */}
          {step === "payment" && (
            <div className="space-y-6">
              <h2 className="font-heading font-bold text-xl text-zinc-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-cyber-cyan" /> Payment Details
              </h2>
              <p className="text-xs text-cyber-muted">This is a simulated payment form. No real charges will be made.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-cyber-muted uppercase tracking-wider mb-1.5">Card Number</label>
                  <input type="text" placeholder="4242 4242 4242 4242" value={payment.cardNumber} onChange={(e) => setPayment({...payment, cardNumber: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-cyber-card border border-zinc-200 text-zinc-900 text-sm focus:border-cyber-cyan focus:outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-cyber-muted uppercase tracking-wider mb-1.5">Name on Card</label>
                  <input type="text" value={payment.cardName} onChange={(e) => setPayment({...payment, cardName: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-cyber-card border border-zinc-200 text-zinc-900 text-sm focus:border-cyber-cyan focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cyber-muted uppercase tracking-wider mb-1.5">Expiry Date</label>
                  <input type="text" placeholder="MM/YY" value={payment.expiry} onChange={(e) => setPayment({...payment, expiry: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-cyber-card border border-zinc-200 text-zinc-900 text-sm focus:border-cyber-cyan focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cyber-muted uppercase tracking-wider mb-1.5">CVV</label>
                  <input type="text" placeholder="123" value={payment.cvv} onChange={(e) => setPayment({...payment, cvv: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-cyber-card border border-zinc-200 text-zinc-900 text-sm focus:border-cyber-cyan focus:outline-none" />
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <button onClick={() => setStep("shipping")} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-600 font-bold text-sm">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setStep("review")} className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-cyber-cyan text-white font-bold text-sm shadow-cyan-glow/30 hover:scale-[1.02] transition-all">
                  Review Order <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* REVIEW STEP */}
          {step === "review" && (
            <div className="space-y-6">
              <h2 className="font-heading font-bold text-xl text-zinc-900">Order Review</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-2xl bg-cyber-card/60 border border-zinc-200 space-y-2">
                  <h4 className="text-xs font-bold text-cyber-cyan uppercase tracking-wider">Shipping To</h4>
                  <p className="text-sm text-zinc-700">{shipping.firstName} {shipping.lastName}</p>
                  <p className="text-xs text-cyber-muted">{shipping.address}, {shipping.city}, {shipping.state} {shipping.zip}</p>
                  <p className="text-xs text-cyber-muted">{shipping.email}</p>
                </div>
                <div className="p-4 rounded-2xl bg-cyber-card/60 border border-zinc-200 space-y-2">
                  <h4 className="text-xs font-bold text-cyber-cyan uppercase tracking-wider">Payment Method</h4>
                  <p className="text-sm text-zinc-700">•••• •••• •••• {payment.cardNumber.slice(-4) || "4242"}</p>
                  <p className="text-xs text-cyber-muted">{payment.cardName || "Cardholder"}</p>
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-2xl bg-cyber-card/60 border border-zinc-200">
                <h4 className="text-xs font-bold text-cyber-cyan uppercase tracking-wider mb-3">Cart Items</h4>
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between py-2 border-b border-zinc-200 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg bg-cyber-card overflow-hidden">
                        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-contain p-1" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-zinc-900">{item.product.name}</div>
                        <div className="text-xs text-cyber-muted">Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="font-bold text-sm text-zinc-900">{formatCurrency(item.product.price * item.quantity)}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 p-4 rounded-2xl bg-cyber-card/60 border border-zinc-200 text-sm">
                <div className="flex justify-between text-cyber-muted"><span>Subtotal</span><span className="text-zinc-900">{formatCurrency(subtotal)}</span></div>
                <div className="flex justify-between text-cyber-muted"><span>Shipping</span><span className="text-cyber-cyan font-semibold">FREE</span></div>
                <div className="flex justify-between text-cyber-muted"><span>Tax (8%)</span><span className="text-zinc-900">{formatCurrency(tax)}</span></div>
                <div className="flex justify-between font-black text-lg text-zinc-900 pt-2 border-t border-zinc-200"><span>Total</span><span className="text-cyber-cyan">{formatCurrency(total)}</span></div>
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={() => setStep("payment")} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-600 font-bold text-sm">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={handlePlaceOrder} className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyber-cyan to-orange-600 text-white font-heading font-bold text-base shadow-cyan-glow/40 hover:scale-[1.02] transition-all">
                  <Lock className="w-4 h-4" /> Place Order — {formatCurrency(total)}
                </button>
              </div>
            </div>
          )}

          {/* CONFIRMATION STEP */}
          {step === "confirmation" && (
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 rounded-full bg-cyber-cyan/20 border-2 border-cyber-cyan text-cyber-cyan mx-auto flex items-center justify-center shadow-cyan-glow">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="font-heading font-black text-3xl text-zinc-900">
                Order Confirmed! 🎉
              </h2>
              <p className="text-sm text-zinc-600 max-w-md mx-auto">
                Thank you for your purchase! Your order #NX-{Math.floor(100000 + Math.random() * 900000)} has been placed and is being processed. You&apos;ll receive a confirmation email shortly.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-bold">
                <Sparkles className="w-4 h-4" /> Estimated Delivery: 3-5 Business Days
              </div>
              <div className="flex justify-center gap-4 pt-4">
                <Link href="/shop" className="px-6 py-3 rounded-xl bg-cyber-cyan text-white font-bold text-sm shadow-cyan-glow">
                  Continue Shopping
                </Link>
                <Link href="/" className="px-6 py-3 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-600 font-bold text-sm">
                  Return Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
