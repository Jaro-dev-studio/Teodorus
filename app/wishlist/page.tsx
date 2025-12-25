"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/storefront";
import { useWishlist } from "@/lib/context/wishlist-context";
import { RevealText } from "@/components/storefront/animated-text";

export default function WishlistPage() {
  const { products, isLoading, clearWishlist } = useWishlist();

  return (
    <div className="pt-12 sm:pt-14 md:pt-16">
      {/* Header */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <RevealText>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground mb-3 sm:mb-4">
              My Wishlist
            </h1>
          </RevealText>
          <RevealText delay={0.1}>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl">
              {products.length > 0
                ? `${products.length} item${products.length === 1 ? "" : "s"} saved for later.`
                : "Save items you love to purchase later."}
            </p>
          </RevealText>
        </div>
      </section>

      {/* Wishlist Items */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-xl bg-secondary animate-pulse"
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="flex justify-end mb-6">
                <button
                  onClick={clearWishlist}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 sm:py-20"
            >
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-3">
                Your wishlist is empty
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Browse our collection and tap the heart icon to save items you love.
              </p>
              <motion.div whileTap={{ scale: 0.98 }}>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background font-medium rounded-full hover:bg-foreground/90 transition-colors"
                >
                  Start Shopping
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
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
