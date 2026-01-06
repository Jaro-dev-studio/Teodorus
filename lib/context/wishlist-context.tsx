"use client";

import * as React from "react";
import { useAuth } from "./auth-context";
import type { Product } from "@/lib/shopify/types";

const WISHLIST_STORAGE_KEY = "triggerTs_wishlist";

interface WishlistContextType {
  items: string[]; // Product IDs
  products: Product[]; // Full product data
  isLoading: boolean;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = React.createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, customer } = useAuth();
  const [items, setItems] = React.useState<string[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Load wishlist from localStorage on mount
  React.useEffect(() => {
    const loadWishlist = () => {
      try {
        const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setItems(parsed);
          }
        }
      } catch (error) {
        console.error("Error loading wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, []);

  // When user logs in, sync local wishlist with their account
  // For now, we merge local wishlist with any stored preferences
  React.useEffect(() => {
    if (isAuthenticated && customer) {
      // In a full implementation, you would sync with a backend/metafields
      // For now, we just keep the local storage approach
      console.log("User authenticated, wishlist synced for:", customer.email);
    }
  }, [isAuthenticated, customer]);

  // Save to localStorage whenever items change
  React.useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoading]);

  // Fetch product data when items change
  React.useEffect(() => {
    const fetchProducts = async () => {
      if (items.length === 0) {
        setProducts([]);
        return;
      }

      try {
        const res = await fetch("/api/products/by-ids", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: items }),
        });
        if (!res.ok) {
          throw new Error("Failed to fetch wishlist products");
        }
        const productData: Product[] = await res.json();
        setProducts(productData);
      } catch (error) {
        console.error("Error fetching wishlist products:", error);
      }
    };

    fetchProducts();
  }, [items]);

  const addItem = (productId: string) => {
    setItems((prev) => {
      if (prev.includes(productId)) return prev;
      return [...prev, productId];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((id) => id !== productId));
  };

  const toggleItem = (productId: string) => {
    if (items.includes(productId)) {
      removeItem(productId);
    } else {
      addItem(productId);
    }
  };

  const isInWishlist = (productId: string) => {
    return items.includes(productId);
  };

  const clearWishlist = () => {
    setItems([]);
    setProducts([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        products,
        isLoading,
        addItem,
        removeItem,
        toggleItem,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = React.useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}


