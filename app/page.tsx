"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Hero, ProductGrid } from "@/components/storefront";
import { RevealText } from "@/components/storefront/animated-text";
import { getProducts } from "@/lib/shopify";
import type { Product } from "@/lib/shopify/types";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts({ first: 6 });
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
      {/* Hero Section */}
      <Hero />

      {/* Featured Products */}
      <ProductGrid
        products={featuredProducts}
        title="Featured"
        showFeatured
        columns={3}
        isLoading={isLoading}
      />

      {/* Brand Story Section */}
      <section className="py-12 sm:py-20 md:py-32 bg-secondary">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-20 items-center">
            <RevealText>
              <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground">
                  Not just shirts.
                  <br />
                  <span className="text-gradient">Statements.</span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Premium materials. Sharp opinions. For those who can laugh at the chaos while looking expensive doing it.
                </p>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 text-primary font-medium animated-underline py-2"
                  >
                    Our Story
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
            </RevealText>

            <RevealText delay={0.2}>
              <div className="relative mt-8 lg:mt-0">
                <div className="aspect-square rounded-xl sm:rounded-2xl bg-card overflow-hidden glow-gold">
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-6xl sm:text-7xl md:text-8xl font-display font-bold text-foreground/[0.03] sm:text-foreground/5">
                      Ts
                    </p>
                  </div>
                </div>
                {/* Floating accent */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-4 sm:-bottom-6 right-4 sm:-right-6 px-4 sm:px-6 py-3 sm:py-4 bg-primary text-primary-foreground rounded-lg sm:rounded-xl shadow-lg"
                >
                  <p className="text-xs sm:text-sm font-medium">100% Organic Cotton</p>
                </motion.div>
              </div>
            </RevealText>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-12 sm:py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {[
              {
                title: "Shop All",
                href: "/shop",
              },
              {
                title: "Collections",
                href: "/collections",
              },
            ].map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Link
                  href={category.href}
                  className="group block relative aspect-[16/9] sm:aspect-[2/1] rounded-xl overflow-hidden bg-card active:scale-[0.98] transition-transform"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-foreground group-hover:text-primary group-active:text-primary transition-colors">
                      {category.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-20 md:py-32 bg-card">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <RevealText>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6 sm:mb-8">
              Ready?
            </h2>
          </RevealText>
          <RevealText delay={0.1}>
            <motion.div whileTap={{ scale: 0.98 }}>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-6 sm:px-8 py-4 bg-foreground text-background font-medium rounded-full hover:bg-foreground/90 active:bg-foreground/90 transition-colors"
              >
                Shop Now
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
          </RevealText>
        </div>
      </section>
    </>
  );
}
