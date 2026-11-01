import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export type StoreMode = "STORE" | "AFFILIATE";

// Site is affiliate-only: all products redirect to Amazon.
const DEFAULT_MODE: StoreMode = "AFFILIATE";

interface StoreState {
  mode: StoreMode;
  cart: CartItem[];
  wishlist: string[];
  isCartOpen: boolean;
  toast: { message: string; type: "success" | "info" | "warning" } | null;

  // Actions
  toggleMode: () => void;
  setMode: (mode: StoreMode) => void;
  addToCart: (product: Product, quantity?: number, color?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  setCartOpen: (isOpen: boolean) => void;
  showToast: (message: string, type?: "success" | "info" | "warning") => void;
  hideToast: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      mode: DEFAULT_MODE,
      cart: [],
      wishlist: [],
      isCartOpen: false,
      toast: null,

      // Mode is locked to AFFILIATE — toggling is a no-op.
      toggleMode: () => set({ mode: "AFFILIATE" }),

      setMode: () => set({ mode: "AFFILIATE" }),

      addToCart: (product, quantity = 1, color) => {
        set((state) => {
          const existingIndex = state.cart.findIndex(
            (item) => item.product.id === product.id && item.selectedColor === color
          );
          let updatedCart = [...state.cart];
          if (existingIndex > -1) {
            updatedCart[existingIndex].quantity += quantity;
          } else {
            updatedCart.push({
              product,
              quantity,
              selectedColor: color || product.colors?.[0],
            });
          }
          return { cart: updatedCart, isCartOpen: true };
        });
        get().showToast(`Added ${product.name} to your cart`, "success");
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        }));
        get().showToast("Item removed from cart", "info");
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (productId) => {
        set((state) => {
          const exists = state.wishlist.includes(productId);
          const newWishlist = exists
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId];
          
          return { wishlist: newWishlist };
        });
        const isAdded = get().wishlist.includes(productId);
        get().showToast(
          isAdded ? "Saved to wishlist" : "Removed from wishlist",
          "info"
        );
      },

      isWishlisted: (productId) => get().wishlist.includes(productId),

      setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),

      showToast: (message, type = "success") => {
        set({ toast: { message, type } });
        setTimeout(() => {
          set({ toast: null });
        }, 3000);
      },

      hideToast: () => set({ toast: null }),
    }),
    {
      name: "nexus-tech-store-storage",
      storage: createJSONStorage(() => localStorage),
      version: 2,
      // Force affiliate mode for users with an old persisted "STORE" mode
      migrate: (persistedState: unknown) => ({
        ...(persistedState as object),
        mode: "AFFILIATE" as StoreMode,
      }),
      partialize: (state) => ({
        mode: state.mode,
        cart: state.cart,
        wishlist: state.wishlist,
      }),
    }
  )
);
