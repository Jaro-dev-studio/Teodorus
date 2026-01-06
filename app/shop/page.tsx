"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/storefront";
import { RevealText } from "@/components/storefront/animated-text";
import type { Product, Collection } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

export default function ShopPage() {
  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const [displayProducts, setDisplayProducts] = React.useState<Product[]>([]);
  const [collections, setCollections] = React.useState<Omit<Collection, "products">[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeCategory, setActiveCategory] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("featured");

  // Initial data fetch
  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsRes, collectionsRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/collections"),
        ]);
        
        if (!productsRes.ok || !collectionsRes.ok) {
          throw new Error("Failed to fetch data");
        }
        
        const productsData: Product[] = await productsRes.json();
        const collectionsData: Omit<Collection, "products">[] = await collectionsRes.json();
        
        setAllProducts(productsData);
        setDisplayProducts(productsData);
        setCollections(collectionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch products when category changes
  React.useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (activeCategory === "all") {
        setDisplayProducts(allProducts);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`/api/collections/${activeCategory}`);
        if (!res.ok) {
          throw new Error("Failed to fetch collection products");
        }
        const data: { collection: Collection | null; products: Product[] } = await res.json();
        setDisplayProducts(data.products);
      } catch (error) {
        console.error("Error fetching collection products:", error);
        setDisplayProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [activeCategory, allProducts]);

  const categories = React.useMemo(() => {
    const allCategory = { id: "all", name: "All", count: allProducts.length };
    const collectionCategories = collections.map((c) => ({
      id: c.handle,
      name: c.title,
      count: 0,
    }));
    return [allCategory, ...collectionCategories];
  }, [collections, allProducts.length]);

  const filteredProducts = React.useMemo(() => {
    const filtered = [...displayProducts];

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
  }, [displayProducts, sortBy]);

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
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 sm:py-4">
            {/* Category filters */}
            {categories.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide min-w-0 order-2 sm:order-1 w-full sm:w-auto sm:flex-1">
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
            <div className="flex items-center gap-2 flex-shrink-0 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
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
