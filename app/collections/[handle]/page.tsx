"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/storefront";
import { RevealText } from "@/components/storefront/animated-text";
import { getCollectionProducts } from "@/lib/shopify";
import type { Product, Collection } from "@/lib/shopify/types";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

export default function CollectionPage() {
  const params = useParams();
  const handle = params.handle as string;
  
  const [collection, setCollection] = React.useState<Collection | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [sortBy, setSortBy] = React.useState("featured");

  React.useEffect(() => {
    const fetchCollection = async () => {
      setIsLoading(true);
      try {
        const { collection: collectionData, products: productsData } = await getCollectionProducts(handle);
        setCollection(collectionData);
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching collection:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (handle) {
      fetchCollection();
    }
  }, [handle]);

  const sortedProducts = React.useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "newest":
        return sorted.reverse();
      default:
        return sorted;
    }
  }, [products, sortBy]);

  return (
    <div className="pt-12 sm:pt-14 md:pt-16">
      {/* Header */}
      <section className="py-8 sm:py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          {isLoading ? (
            <>
              <div className="h-12 w-64 bg-secondary rounded-lg animate-pulse mb-4" />
              <div className="h-6 w-96 bg-secondary rounded-lg animate-pulse" />
            </>
          ) : (
            <>
              <RevealText>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-3 sm:mb-4">
                  {collection?.title || "Collection"}
                </h1>
              </RevealText>
              {collection?.description && (
                <RevealText delay={0.1}>
                  <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl">
                    {collection.description}
                  </p>
                </RevealText>
              )}
            </>
          )}
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border sticky top-12 sm:top-14 md:top-16 z-30 bg-background/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <span className="text-sm text-muted-foreground">
              {sortedProducts.length} products
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 bg-secondary text-foreground text-sm rounded-lg px-3 border-0 focus:ring-2 focus:ring-primary cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-xl bg-secondary animate-pulse"
                />
              ))}
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              {sortedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground">
                No products found in this collection.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
