"use client";

import * as React from "react";
import { Navigation } from "./navigation";
import { Footer } from "./footer";
import { CartDrawer, CartProvider, useCart } from "./cart-drawer";

function StorefrontLayoutInner({ children }: { children: React.ReactNode }) {
  const { items, isOpen, closeCart, updateQuantity, removeItem, openCart } = useCart();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation cartItemCount={items.length} onCartClick={openCart} />
      
      <main className="flex-1">
        {children}
      </main>

      <Footer />

      <CartDrawer
        isOpen={isOpen}
        onClose={closeCart}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
    </div>
  );
}

export function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <StorefrontLayoutInner>{children}</StorefrontLayoutInner>
    </CartProvider>
  );
}

