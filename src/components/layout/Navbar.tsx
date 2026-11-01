"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, Heart, Menu, X, Cpu, ArrowRight, ChevronDown } from "lucide-react";
import { PRODUCTS, Product, CATEGORY_NAMES } from "@/data/products";
import { useStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const cart = useStore((state) => state.cart);
  const wishlist = useStore((state) => state.wishlist);
  const setCartOpen = useStore((state) => state.setCartOpen);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Search Filter
  const filteredProducts = searchQuery.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        if (!searchQuery.trim()) setIsSearchExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchQuery]);

  useEffect(() => {
    if (isSearchExpanded) searchInputRef.current?.focus();
  }, [isSearchExpanded]);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-cyber-bg/80 transition-all font-fairplay">
      <div className="w-full px-[30px] h-16 flex items-center gap-4">
        {/* Center group: logo + nav links + search icon — all centered together */}
        <div className="flex-1 flex items-center justify-center gap-6">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyber-cyan to-cyber-violet flex items-center justify-center text-white shadow-cyan-glow/40 group-hover:scale-105 transition-transform">
              <Cpu className="w-6 h-6 stroke-[2.5]" />
            </div>
            {/* <div className="flex flex-col">
              <span className="font-heading font-black text-xl tracking-wider text-zinc-900 group-hover:text-cyber-cyan transition-colors">
                NEXUS<span className="text-cyber-cyan">.TECH</span>
              </span>
              <span className="text-[9px] font-bold tracking-widest text-cyber-muted uppercase -mt-1">
                Next-Gen Store
              </span>
            </div> */}
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-zinc-600">
            <Link href="/" className="hover:text-cyber-cyan transition-colors">
              Home
            </Link>
            <Link href="/shop" className="hover:text-cyber-cyan transition-colors">
              Shop All
            </Link>
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-1 hover:text-cyber-cyan transition-colors"
              >
                Categories
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 hidden group-hover:block group-focus-within:block">
                <div className="w-60 max-h-[70vh] overflow-y-auto scrollbar-hide rounded-2xl bg-zinc-100/95 backdrop-blur-2xl border border-cyber-cyan/30 shadow-2xl p-2">
                  {CATEGORY_NAMES.map((category) => (
                    <Link
                      key={category}
                      href={`/shop?category=${encodeURIComponent(category)}`}
                      className="block px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-cyber-cyan/10 hover:text-cyber-cyan transition-colors"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Icon Search with Expandable Input & Suggestions */}
          <div ref={searchRef} className="relative hidden sm:flex items-center">
            {isSearchExpanded ? (
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search flagship gear, brands..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  className="w-48 md:w-64 pl-9 pr-8 py-2 rounded-full bg-cyber-glass text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none transition-all"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-cyber-muted" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsSearchExpanded(true)}
                className="p-2.5 rounded-xl bg-cyber-glass text-zinc-600 hover:text-cyber-cyan transition-all"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Autocomplete Popup */}
            {isSearchOpen && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-zinc-100/95 backdrop-blur-2xl border border-cyber-cyan/30 shadow-2xl overflow-hidden z-50 p-2">
                {filteredProducts.length > 0 ? (
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold tracking-wider text-cyber-muted px-3 py-1.5 uppercase">
                      Matching Products ({filteredProducts.length})
                    </div>
                    {filteredProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-cyber-cyan/10 transition-colors"
                      >
                        <div className="relative w-10 h-10 rounded-lg bg-cyber-card overflow-hidden shrink-0">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-zinc-900 truncate">
                            {product.name}
                          </div>
                          <div className="text-[11px] text-cyber-cyan font-bold">
                            {formatCurrency(product.price)}
                          </div>
                        </div>
                      </Link>
                    ))}
                    <Link
                      href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center justify-between px-3 py-2 text-xs font-bold text-cyber-cyan hover:bg-cyber-cyan/10 rounded-xl transition-colors border-t border-zinc-200 mt-1"
                    >
                      <span>View all matching results</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-cyber-muted">
                    No tech found matching &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Actions: pinned to the far right */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Wishlist Link */}
          <Link
            href="/wishlist"
            className="relative p-2.5 rounded-xl bg-cyber-glass text-zinc-600 hover:text-cyber-pink transition-all"
            aria-label="View Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-cyber-pink text-black font-bold text-[10px] flex items-center justify-center shadow-pink-glow">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Icon Button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2.5 rounded-xl bg-cyber-cyan/10 text-cyber-cyan hover:bg-cyber-cyan/20 transition-all"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-cyber-cyan text-white font-bold text-[10px] flex items-center justify-center shadow-cyan-glow">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-xl bg-cyber-glass text-zinc-600 lg:hidden"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-cyber-bg/95 backdrop-blur-2xl px-4 py-6 space-y-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-100 text-sm text-zinc-900"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-cyber-muted" />
          </div>

          <nav className="flex flex-col space-y-3 font-semibold text-zinc-700 text-sm">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>
              Shop All Products
            </Link>
            {CATEGORY_NAMES.map((category) => (
              <Link
                key={category}
                href={`/shop?category=${encodeURIComponent(category)}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {category}
              </Link>
            ))}
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>
              About Us
            </Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
              Contact Support
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
