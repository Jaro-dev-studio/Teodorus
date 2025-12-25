"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation, Footer, CartDrawer, ProductCard } from "@/components/storefront";
import { RevealText } from "@/components/storefront/animated-text";
import { CartProvider, useCart } from "@/components/storefront/cart-drawer";
import { getProductByHandle, products } from "@/lib/products";
import { cn } from "@/lib/utils";

function ProductContent() {
  const params = useParams();
  const handle = params.handle as string;
  const product = getProductByHandle(handle);
  
  const { items, isOpen, closeCart, updateQuantity, removeItem, openCart, addItem } = useCart();
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [isAdding, setIsAdding] = React.useState(false);

  const relatedProducts = products
    .filter(p => p.id !== product?.id)
    .slice(0, 4);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-5">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
            Product Not Found
          </h1>
          <p className="text-muted-foreground mb-6 sm:mb-8">
            This shirt doesn&apos;t exist. Yet.
          </p>
          <motion.div whileTap={{ scale: 0.98 }}>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary-hover active:bg-primary-hover transition-colors"
            >
              Back to Shop
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) return;
    
    setIsAdding(true);
    setTimeout(() => {
      addItem({
        id: `${product.id}-${selectedSize}`,
        title: product.title,
        price: product.price,
        size: selectedSize,
        image: product.image,
      });
      setIsAdding(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation cartItemCount={items.length} onCartClick={openCart} />

      <main className="pt-14 sm:pt-16 md:pt-20">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-3 sm:py-4">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground overflow-x-auto scrollbar-hide">
            <Link href="/" className="hover:text-foreground active:text-foreground transition-colors whitespace-nowrap">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-foreground active:text-foreground transition-colors whitespace-nowrap">
              Shop
            </Link>
            <span>/</span>
            <span className="text-foreground truncate">{product.title}</span>
          </nav>
        </div>

        {/* Product Details */}
        <section className="py-4 sm:py-6 md:py-12">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 xl:gap-16">
              {/* Product Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-[3/4] sm:aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden bg-secondary"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-[8rem] sm:text-[10rem] md:text-[12rem] font-display font-bold text-foreground/[0.03] sm:text-foreground/5">
                    {product.title.split(" ")[0].charAt(0)}
                  </p>
                </div>

                {/* Sale badge */}
                {product.compareAtPrice && (
                  <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
                    <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-primary-foreground text-xs sm:text-sm font-bold rounded-full">
                      Save ${product.compareAtPrice - product.price}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col"
              >
                {/* Tags */}
                <div className="flex gap-2 mb-3 sm:mb-4">
                  {product.tags.includes("bestseller") && (
                    <span className="px-2.5 sm:px-3 py-1 bg-accent/10 text-accent text-[10px] sm:text-xs font-medium rounded-full">
                      Bestseller
                    </span>
                  )}
                  {product.category && (
                    <span className="px-2.5 sm:px-3 py-1 bg-secondary text-muted-foreground text-[10px] sm:text-xs font-medium rounded-full capitalize">
                      {product.category}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-2">
                  {product.title}
                </h1>

                {/* Tagline */}
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground italic mb-4 sm:mb-6">
                  &ldquo;{product.tagline}&rdquo;
                </p>

                {/* Price */}
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <span className="text-2xl sm:text-3xl font-bold text-foreground">
                    ${product.price}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-lg sm:text-xl text-muted-foreground line-through">
                      ${product.compareAtPrice}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 sm:mb-8">
                  {product.description}
                </p>

                {/* Size selector */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">
                      Select Size
                    </span>
                    <button className="text-xs sm:text-sm text-muted-foreground hover:text-foreground active:text-foreground transition-colors">
                      Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {product.sizes.map((size) => (
                      <motion.button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          "h-12 sm:h-11 min-w-[48px] sm:min-w-[44px] px-4 rounded-lg font-medium transition-colors",
                          selectedSize === size
                            ? "bg-foreground text-background"
                            : "bg-secondary text-foreground hover:bg-border active:bg-border"
                        )}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                  <AnimatePresence>
                    {!selectedSize && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs sm:text-sm text-muted-foreground mt-2"
                      >
                        Please select a size
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Add to cart */}
                <motion.button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || isAdding}
                  whileTap={{ scale: selectedSize ? 0.98 : 1 }}
                  className={cn(
                    "w-full h-14 sm:h-12 rounded-full font-medium text-base sm:text-lg transition-all",
                    selectedSize
                      ? "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-hover cursor-pointer"
                      : "bg-secondary text-muted-foreground cursor-not-allowed"
                  )}
                >
                  {isAdding ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Adding...
                    </span>
                  ) : (
                    "Add to Rotation"
                  )}
                </motion.button>

                {/* Additional info */}
                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Free shipping on orders over $100</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>30-day returns, no questions asked</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>100% organic cotton, ethically made</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="py-12 sm:py-16 md:py-20 border-t border-border">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <RevealText>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-foreground mb-6 sm:mb-8">
                You Might Also Like
              </h2>
            </RevealText>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {relatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
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

export default function ProductPage() {
  return (
    <CartProvider>
      <ProductContent />
    </CartProvider>
  );
}
