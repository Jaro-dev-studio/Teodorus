"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  index?: number;
  priority?: boolean;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isTouched, setIsTouched] = React.useState(false);

  // Handle touch interactions for mobile
  const handleTouchStart = () => setIsTouched(true);
  const handleTouchEnd = () => setTimeout(() => setIsTouched(false), 300);

  const isActive = isHovered || isTouched;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.08, 0.4), // Cap delay for better mobile UX
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="group relative"
    >
      <Link 
        href={`/product/${product.handle}`} 
        className="block touch-manipulation"
      >
        {/* Image container - Optimized aspect ratio for mobile */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl sm:rounded-lg bg-secondary mb-3 sm:mb-4">
          {/* Product image placeholder */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary to-card"
            animate={{
              scale: isActive ? 1.03 : 1,
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-center p-4 sm:p-6">
              <p className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground/[0.03] sm:text-foreground/5">
                {product.title.split(" ")[0]}
              </p>
            </div>
          </motion.div>

          {/* Gradient overlay on hover/touch */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.25 }}
          />

          {/* Tagline reveal on hover/touch */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-3 sm:p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
            transition={{ duration: 0.25 }}
          >
            <p className="text-xs sm:text-sm text-foreground/90 italic line-clamp-2">
              &ldquo;{product.tagline}&rdquo;
            </p>
          </motion.div>

          {/* Quick add button - Larger touch target on mobile */}
          <motion.button
            className={cn(
              "absolute top-3 right-3 sm:top-4 sm:right-4 h-11 w-11 sm:h-10 sm:w-10",
              "flex items-center justify-center rounded-full",
              "bg-foreground text-background",
              "opacity-0 group-hover:opacity-100 transition-opacity",
              "sm:opacity-0", // Only show on hover for desktop
              isActive && "opacity-100" // Show on touch for mobile
            )}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Add to cart logic
            }}
            aria-label={`Quick add ${product.title}`}
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </motion.button>

          {/* Sale / New badge */}
          {product.compareAtPrice && (
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
              <span className="inline-block px-2.5 py-1 sm:px-3 bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold rounded-full">
                Sale
              </span>
            </div>
          )}
          {product.tags.includes("bestseller") && !product.compareAtPrice && (
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
              <span className="inline-block px-2.5 py-1 sm:px-3 bg-accent text-accent-foreground text-[10px] sm:text-xs font-bold rounded-full">
                Bestseller
              </span>
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="space-y-1 sm:space-y-2 px-0.5">
          {/* Title */}
          <h3 className="font-medium text-sm sm:text-base text-foreground group-hover:text-primary group-active:text-primary transition-colors duration-200 line-clamp-1">
            {product.title}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base text-foreground font-medium">
              ${product.price}
            </span>
            {product.compareAtPrice && (
              <span className="text-muted-foreground line-through text-xs sm:text-sm">
                ${product.compareAtPrice}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

/**
 * Featured product card - larger with more details
 */
interface FeaturedProductCardProps {
  product: Product;
  reverse?: boolean;
}

export function FeaturedProductCard({ product, reverse = false }: FeaturedProductCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="grid md:grid-cols-2 gap-6 md:gap-10 lg:gap-12 items-center"
    >
      {/* Image */}
      <Link
        href={`/product/${product.handle}`}
        className={cn(
          "block touch-manipulation",
          reverse && "md:order-2"
        )}
      >
        <motion.div
          className="relative aspect-[4/5] sm:aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-xl sm:rounded-2xl bg-secondary group"
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary to-card">
            <p className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-foreground/[0.03] sm:text-foreground/5">
              {product.title.split(" ")[0]}
            </p>
          </div>

          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300" />
        </motion.div>
      </Link>

      {/* Content */}
      <div className={cn(
        "space-y-4 sm:space-y-5 md:space-y-6 px-1 sm:px-0",
        reverse && "md:order-1 md:text-right"
      )}>
        {product.tags.includes("bestseller") && (
          <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-accent/10 text-accent text-xs sm:text-sm font-medium">
            Bestseller
          </span>
        )}

        <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground">
          {product.title}
        </h3>

        <p className="text-lg sm:text-xl text-muted-foreground italic">
          &ldquo;{product.tagline}&rdquo;
        </p>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {product.description}
        </p>

        <div className={cn(
          "flex items-center gap-3 sm:gap-4 flex-wrap",
          reverse && "md:justify-end"
        )}>
          <span className="text-xl sm:text-2xl font-bold text-foreground">
            ${product.price}
          </span>
          {product.compareAtPrice && (
            <span className="text-base sm:text-lg text-muted-foreground line-through">
              ${product.compareAtPrice}
            </span>
          )}
        </div>

        <motion.div whileTap={{ scale: 0.98 }}>
          <Link
            href={`/product/${product.handle}`}
            className={cn(
              "inline-flex items-center justify-center gap-2",
              "w-full sm:w-auto",
              "px-6 py-3.5 sm:py-3",
              "bg-primary text-primary-foreground font-medium rounded-full",
              "hover:bg-primary-hover active:bg-primary-hover transition-colors"
            )}
          >
            View Details
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
      </div>
    </motion.article>
  );
}
