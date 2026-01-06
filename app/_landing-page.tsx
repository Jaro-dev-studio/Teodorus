"use client";

import * as React from "react";
import {
  Hero,
  SecretReveal,
  PremiumQuality,
  IfYouKnow,
  ProductGrid,
} from "@/components/storefront";
import type { Product } from "@/lib/shopify/types";

export default function LandingPage() {
  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products?first=4");
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const products: Product[] = await res.json();
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      {/* Cinematic Hero - Brand intro */}
      <Hero />

      {/* The Secret Reveal - Flip animation showing hidden message */}
      <SecretReveal />

      {/* Premium Quality - Craftsmanship pillars */}
      <PremiumQuality />

      {/* Featured Products - Show a few pieces */}
      <ProductGrid
        products={featuredProducts}
        title="The Collection"
        subtitle="Each piece carries its own inscription"
        columns={4}
        isLoading={isLoading}
      />

      {/* If You Know - Community/insider section */}
      <IfYouKnow />
    </>
  );
}

