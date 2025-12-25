"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/storefront";
import { RevealText } from "@/components/storefront/animated-text";
import { getProducts, getCollections } from "@/lib/shopify";
import type { Product, Collection } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

export default function ShopPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [collections, setCollections] = React.useState<Omit<Collection, "products">[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeCategory, setActiveCategory] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("featured");

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsData, collectionsData] = await Promise.all([
          getProducts(),
          getCollections(),
        ]);
        setProducts(productsData);
        setCollections(collectionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = React.useMemo(() => {
    const allCategory = { id: "all", name: "All", count: products.length };
    const collectionCategories = collections.map((c) => ({
      id: c.handle,
      name: c.title,
      count: 0,
    }));
    return [allCategory, ...collectionCategories];
  }, [collections, products.length]);

  const filteredProducts = React.useMemo(() => {
    let filtered = [...products];

    switch (sortBy) {
      case "price-low":
        return filtered.sort((a, b) => a.price - b.price);
      case "price-high":
        return filtered.sort((a, b) => b.price - a.price);
      case "newest":
        return filtered.reverse();
      default:
        return filtered;
    }
  }, [products, sortBy]);

  return (
    <div className="pt-12 sm:pt-14 md:pt-16">
      {/* Header */}
      <section className="py-8 sm:py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <RevealText>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground">
              Shop
            </h1>
          </RevealText>
        </div>
      </section>

      {/* Filters */}
      <section className="border-y border-border sticky top-12 sm:top-14 md:top-16 z-30 bg-background/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 py-3 sm:py-4">
            {/* Category filters */}
            {categories.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
                {categories.slice(0, 6).map((category) => (
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
                  </motion.button>
                ))}
              </div>
            )}

            {/* Sort dropdown */}
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground sm:mr-2">
                {filteredProducts.length} products
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 sm:h-9 bg-secondary text-foreground text-sm rounded-lg px-3 border-0 focus:ring-2 focus:ring-primary cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-6 sm:py-8 md:py-12">
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
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 sm:py-20">
              <p className="text-muted-foreground mb-4">
                No products found.
              </p>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveCategory("all")}
                className="text-primary font-medium"
              >
                View all
              </motion.button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
