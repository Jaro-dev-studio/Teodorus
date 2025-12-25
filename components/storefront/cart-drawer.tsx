"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { shopifyFetch, isShopifyConfigured } from "@/lib/shopify/client";
import { CREATE_CART } from "@/lib/shopify/queries";

interface CartItem {
  id: string;
  variantId?: string;
  title: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (items.length === 0 || isCheckingOut) return;
    
    setIsCheckingOut(true);
    
    try {
      console.log("[Checkout] Starting checkout process...");
      console.log("[Checkout] Cart items:", JSON.stringify(items, null, 2));
      
      if (!isShopifyConfigured()) {
        console.error("[Checkout] Shopify is not configured");
        alert("Checkout is not available at the moment. Please try again later.");
        setIsCheckingOut(false);
        return;
      }

      // Build cart lines from items - need variant IDs for Shopify
      const lines = items.map((item) => ({
        merchandiseId: item.variantId || item.id,
        quantity: item.quantity,
      }));

      console.log("[Checkout] Cart lines to send:", JSON.stringify(lines, null, 2));
      console.log("[Checkout] CREATE_CART query:", CREATE_CART);

      const data = await shopifyFetch<{
        cartCreate: {
          cart: {
            id: string;
            checkoutUrl: string;
          } | null;
          userErrors: Array<{ field: string[]; message: string }>;
        };
      }>({
        query: CREATE_CART,
        variables: { input: { lines } },
        cache: "no-store",
      });

      console.log("[Checkout] Shopify response:", JSON.stringify(data, null, 2));

      if (data.cartCreate.userErrors.length > 0) {
        console.error("[Checkout] Cart creation errors:", data.cartCreate.userErrors);
        alert(`Failed to create checkout: ${data.cartCreate.userErrors.map(e => e.message).join(", ")}`);
        setIsCheckingOut(false);
        return;
      }

      if (data.cartCreate.cart?.checkoutUrl) {
        console.log("[Checkout] Redirecting to:", data.cartCreate.cart.checkoutUrl);
        // Redirect to Shopify checkout
        window.location.href = data.cartCreate.cart.checkoutUrl;
      } else {
        console.error("[Checkout] No checkout URL in response");
        alert("Failed to get checkout URL. Please try again.");
        setIsCheckingOut(false);
      }
    } catch (error) {
      console.error("[Checkout] Error:", error);
      console.error("[Checkout] Error details:", error instanceof Error ? error.message : String(error));
      console.error("[Checkout] Error stack:", error instanceof Error ? error.stack : "No stack");
      alert(`An error occurred during checkout: ${error instanceof Error ? error.message : "Unknown error"}`);
      setIsCheckingOut(false);
    }
  };

  // Lock body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer - Full width on mobile */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[400px] sm:max-w-[90vw] bg-background border-l border-border shadow-2xl flex flex-col"
          >
            {/* Header - Safe area aware */}
            <div className="border-b border-border safe-area-inset-top">
              <div className="flex items-center justify-between px-6 sm:px-8 h-16">
                <h2 className="text-sm font-medium tracking-widest uppercase text-foreground">
                  Cart {items.length > 0 && <span className="text-muted-foreground">({items.length})</span>}
                </h2>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-secondary active:bg-secondary transition-colors"
                  aria-label="Close cart"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Cart items - Scrollable */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-6 sm:px-8 py-10">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-8">
                    <svg
                      className="w-9 h-9 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.25}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-display text-foreground mb-3">
                    Your cart is empty
                  </h3>
                  <p className="text-sm text-muted-foreground mb-10 max-w-[200px]">
                    Discover our curated collection
                  </p>
                  <Button asChild className="w-full max-w-[240px] rounded-full h-12">
                    <Link href="/shop" onClick={onClose}>
                      Shop Now
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-4"
                    >
                      {/* Product image */}
                      <div className="w-24 h-28 bg-secondary flex-shrink-0 overflow-hidden rounded-lg">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-foreground/5 font-display text-xl">
                            {item.title.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Product info */}
                      <div className="flex-1 min-w-0 flex flex-col">
                        <h3 className="text-sm font-medium text-foreground leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Size: {item.size}
                        </p>
                        <p className="text-sm text-foreground mt-1">
                          ${item.price.toFixed(2)}
                        </p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-4 mt-auto pt-3">
                          <div className="flex items-center border border-border rounded-full">
                            <button
                              onClick={() =>
                                onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))
                              }
                              className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary active:text-foreground transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M20 12H4"
                                />
                              </svg>
                            </button>
                            <span className="w-8 text-center text-xs font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                onUpdateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary active:text-foreground transition-colors"
                              aria-label="Increase quantity"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Safe area aware */}
            {items.length > 0 && (
              <div className="border-t border-border px-6 sm:px-8 py-6 space-y-5 safe-area-inset-bottom bg-background">
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="text-lg font-display text-foreground">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Shipping and taxes calculated at checkout
                  </p>
                </div>
                <div className="space-y-3 pt-1">
                  <button 
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full h-12 rounded-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {isCheckingOut && (
                      <svg
                        className="h-4 w-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    )}
                    {isCheckingOut ? "Processing..." : "Checkout"}
                  </button>
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    className="w-full h-10 rounded-full"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Simple cart context for state management
 */
interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { variantId?: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = React.createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);

  const addItem = (newItem: Omit<CartItem, "quantity"> & { variantId?: string }) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.id === newItem.id && item.size === newItem.size
      );
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setItems([]);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
