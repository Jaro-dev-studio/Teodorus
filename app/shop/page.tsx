"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation, ProductCard, Footer, CartDrawer } from "@/components/storefront";
import { RevealText } from "@/components/storefront/animated-text";
import { CartProvider, useCart } from "@/components/storefront/cart-drawer";
import { products, categories } from "@/lib/products";
import { cn } from "@/lib/utils";

function ShopContent() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, openCart } = useCart();
  const [activeCategory, setActiveCategory] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("featured");

  const filteredProducts = React.useMemo(() => {
    const filtered = activeCategory === "all" 
      ? products 
      : products.filter(p => p.category === activeCategory);

    switch (sortBy) {
      case "price-low":
        return [...filtered].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...filtered].sort((a, b) => b.price - a.price);
      case "newest":
        return [...filtered].reverse();
      default:
        return filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [activeCategory, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation cartItemCount={items.length} onCartClick={openCart} />

      <main className="pt-14 sm:pt-16 md:pt-20">
        {/* Header */}
        <section className="py-8 sm:py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <RevealText>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-3 sm:mb-4">
                All Shirts
              </h1>
            </RevealText>
            <RevealText delay={0.1}>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl">
                Every opinion, every statement, every chance to start a conversation. 
                Or end one.
              </p>
            </RevealText>
          </div>
        </section>

        {/* Filters - Sticky on scroll */}
        <section className="border-y border-border sticky top-14 sm:top-16 md:top-20 z-30 bg-background/95 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 py-3 sm:py-4">
              {/* Category filters - Horizontal scroll on mobile */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "h-10 sm:h-9 px-4 sm:px-4 text-sm font-medium rounded-full whitespace-nowrap transition-colors",
                      activeCategory === category.id
                        ? "bg-foreground text-background"
                        : "bg-secondary text-muted-foreground hover:text-foreground active:text-foreground"
                    )}
                  >
                    {category.name}
                    <span className="ml-1.5 text-xs opacity-60 hidden sm:inline">
                      ({category.count})
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Sort dropdown */}
              <div className="flex items-center justify-between sm:justify-end gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground sm:mr-2">
                  {filteredProducts.length} products
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-10 sm:h-9 bg-secondary text-foreground text-sm rounded-lg px-3 border-0 focus:ring-2 focus:ring-primary cursor-pointer appearance-none"
                  style={{ backgroundImage: 'none' }}
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="py-6 sm:py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16 sm:py-20">
                <p className="text-muted-foreground mb-4">
                  No products found in this category.
                </p>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveCategory("all")}
                  className="text-primary font-medium"
                >
                  View all products
                </motion.button>
              </div>
            )}
          </div>
        </section>
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

export default function ShopPage() {
  return (
    <CartProvider>
      <ShopContent />
    </CartProvider>
  );
}
