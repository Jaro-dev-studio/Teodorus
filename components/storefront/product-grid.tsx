"use client";

import * as React from "react";
import { ProductCard, FeaturedProductCard } from "./product-card";
import { RevealText } from "./animated-text";
import type { Product } from "@/lib/shopify/types";

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  showFeatured?: boolean;
  columns?: 2 | 3 | 4;
  isLoading?: boolean;
}

export function ProductGrid({
  products,
  title,
  subtitle,
  showFeatured = false,
  columns = 4,
  isLoading = false,
}: ProductGridProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 xl:grid-cols-4",
  };

  // If showing featured, take first 2 products for featured cards and rest for grid
  const featuredProducts = showFeatured ? products.slice(0, 2) : [];
  const gridProducts = showFeatured ? products.slice(2) : products;

  return (
    <section className="py-12 sm:py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Section header */}
        {(title || subtitle) && (
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            {title && (
              <RevealText>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-3 sm:mb-4">
                  {title}
                </h2>
              </RevealText>
            )}
            {subtitle && (
              <RevealText delay={0.1}>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-md mx-auto">
                  {subtitle}
                </p>
              </RevealText>
            )}
          </div>
        )}

        {isLoading ? (
          // Loading skeleton
          <div className={`grid ${gridCols[columns]} gap-4 sm:gap-5 md:gap-6 lg:gap-8`}>
            {[...Array(columns === 3 ? 6 : 8)].map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-xl bg-secondary animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Featured products - larger cards */}
            {showFeatured && featuredProducts.length > 0 && (
              <div className="space-y-12 sm:space-y-16 md:space-y-20 mb-12 sm:mb-16 md:mb-20">
                {featuredProducts.map((product, index) => (
                  <FeaturedProductCard
                    key={product.id}
                    product={product}
                    reverse={index % 2 === 1}
                  />
                ))}
              </div>
            )}

            {/* Product grid */}
            {gridProducts.length > 0 && (
              <div className={`grid ${gridCols[columns]} gap-4 sm:gap-5 md:gap-6 lg:gap-8`}>
                {gridProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    priority={index < 4}
                  />
                ))}
              </div>
            )}

            {/* Empty state */}
            {products.length === 0 && (
              <div className="text-center py-16 sm:py-20">
                <p className="text-muted-foreground">No products found.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
