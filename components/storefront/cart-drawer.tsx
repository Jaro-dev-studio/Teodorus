"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface CartItem {
  id: string;
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
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border safe-area-inset-top">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                Your Cart ({items.length})
              </h2>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="h-11 w-11 sm:h-10 sm:w-10 flex items-center justify-center rounded-full hover:bg-secondary active:bg-secondary transition-colors"
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

            {/* Cart items - Scrollable */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-foreground font-medium mb-2">
                    Your cart is empty.
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Time to make a statement.
                  </p>
                  <motion.div whileTap={{ scale: 0.98 }} className="w-full max-w-xs">
                    <Link
                      href="/shop"
                      onClick={onClose}
                      className="flex items-center justify-center gap-2 w-full h-12 sm:h-11 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary-hover active:bg-primary-hover transition-colors"
                    >
                      Browse Collection
                    </Link>
                  </motion.div>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-3 sm:gap-4"
                    >
                      {/* Product image */}
                      <div className="w-20 h-24 sm:w-20 sm:h-24 rounded-lg bg-secondary flex-shrink-0 overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center text-foreground/10 font-display text-base sm:text-lg">
                          TT
                        </div>
                      </div>

                      {/* Product info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm sm:text-base text-foreground truncate">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                          Size: {item.size}
                        </p>
                        <p className="text-sm font-medium text-foreground mt-0.5 sm:mt-1">
                          ${item.price}
                        </p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-3 mt-2 sm:mt-3">
                          <div className="flex items-center border border-border rounded-full">
                            <button
                              onClick={() =>
                                onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))
                              }
                              className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center text-muted-foreground hover:text-foreground active:text-foreground transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M20 12H4"
                                />
                              </svg>
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                onUpdateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center text-muted-foreground hover:text-foreground active:text-foreground transition-colors"
                              aria-label="Increase quantity"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-xs sm:text-sm text-muted-foreground hover:text-destructive active:text-destructive transition-colors py-1"
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
              <div className="border-t border-border p-4 sm:p-6 space-y-3 sm:space-y-4 safe-area-inset-bottom bg-background">
                <div className="flex justify-between text-base sm:text-lg">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-foreground">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Shipping and taxes calculated at checkout.
                </p>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-14 sm:h-12 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary-hover active:bg-primary-hover transition-colors"
                >
                  Proceed Anyway
                </motion.button>
                <button
                  onClick={onClose}
                  className="w-full h-12 sm:h-10 text-center text-muted-foreground hover:text-foreground active:text-foreground transition-colors"
                >
                  Continue Shopping
                </button>
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
  addItem: (item: Omit<CartItem, "quantity">) => void;
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

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
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
