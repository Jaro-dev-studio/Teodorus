"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ProductCard, FeaturedProductCard } from "./product-card";
import { RevealText } from "./animated-text";
import type { Product } from "@/lib/products";

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4;
  showFeatured?: boolean;
}

export function ProductGrid({
  products,
  title,
  subtitle,
  columns = 4,
  showFeatured = false,
}: ProductGridProps) {
  // Mobile-first grid columns
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 xl:grid-cols-4",
  };

  if (showFeatured && products.length >= 2) {
    const featured = products.slice(0, 2);
    const rest = products.slice(2);

    return (
      <section className="py-12 sm:py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          {(title || subtitle) && (
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              {title && (
                <RevealText>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-3 sm:mb-4">
                    {title}
                  </h2>
                </RevealText>
              )}
              {subtitle && (
                <RevealText delay={0.1}>
                  <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                    {subtitle}
                  </p>
                </RevealText>
              )}
            </div>
          )}

          {/* Featured products */}
          <div className="space-y-12 sm:space-y-16 md:space-y-24 mb-12 sm:mb-16 md:mb-24">
            {featured.map((product, index) => (
              <FeaturedProductCard
                key={product.id}
                product={product}
                reverse={index % 2 === 1}
              />
            ))}
          </div>

          {/* Rest of products */}
          {rest.length > 0 && (
            <div className={`grid ${gridCols[columns]} gap-4 sm:gap-5 md:gap-6 lg:gap-8`}>
              {rest.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        {(title || subtitle) && (
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            {title && (
              <RevealText>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-3 sm:mb-4">
                  {title}
                </h2>
              </RevealText>
            )}
            {subtitle && (
              <RevealText delay={0.1}>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                  {subtitle}
                </p>
              </RevealText>
            )}
          </div>
        )}

        {/* Product grid - Mobile first 2 columns */}
        <div className={`grid ${gridCols[columns]} gap-4 sm:gap-5 md:gap-6 lg:gap-8`}>
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Horizontal scrolling product showcase - Touch optimized
 */
interface ProductShowcaseProps {
  products: Product[];
  title?: string;
}

export function ProductShowcase({ products, title }: ProductShowcaseProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  return (
    <section className="py-12 sm:py-20 md:py-32 overflow-hidden">
      {title && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 md:mb-12">
          <RevealText>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground">
              {title}
            </h2>
          </RevealText>
        </div>
      )}

      {/* Horizontal scroll container - Touch optimized */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-5 md:gap-6 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            className="flex-shrink-0 w-[70vw] sm:w-[45vw] md:w-[320px] snap-start"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: Math.min(index * 0.08, 0.3), duration: 0.5 }}
          >
            <ProductCard product={product} index={0} />
          </motion.div>
        ))}
        {/* Spacer for last item */}
        <div className="flex-shrink-0 w-4 sm:w-6 lg:w-8" />
      </div>
    </section>
  );
}
