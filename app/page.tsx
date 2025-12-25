"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navigation, Hero, ProductGrid, Footer, CartDrawer } from "@/components/storefront";
import { RevealText } from "@/components/storefront/animated-text";
import { CartProvider, useCart } from "@/components/storefront/cart-drawer";
import { getFeaturedProducts } from "@/lib/products";

function HomeContent() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, openCart } = useCart();
  const featuredProducts = getFeaturedProducts();

  return (
    <div className="min-h-screen bg-background">
      <Navigation cartItemCount={items.length} onCartClick={openCart} />

      <main>
        {/* Hero Section */}
        <Hero />

        {/* Featured Products */}
        <ProductGrid
          products={featuredProducts}
          title="Featured Statements"
          subtitle="The opinions people can't stop talking about."
          showFeatured
          columns={3}
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
                    TriggerTs was born from a simple observation: the smartest people 
                    in the room often have the sharpest sense of humor. We make clothes 
                    for those who can laugh at the chaos while looking expensive doing it.
                  </p>
                  <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
                    Every piece is crafted with premium materials and printed with 
                    opinions that might make someone uncomfortable. That&apos;s the point.
                  </p>
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-2 text-primary font-medium animated-underline py-2"
                    >
                      Read Our Story
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
                    <p className="text-xs sm:text-sm font-medium">Premium Quality</p>
                    <p className="text-[10px] sm:text-xs opacity-80">100% Organic Cotton</p>
                  </motion.div>
                </div>
              </RevealText>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 sm:py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <RevealText>
              <div className="text-center mb-8 sm:mb-12 md:mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-3 sm:mb-4">
                  Browse by Mood
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-md mx-auto">
                  Find the perfect shirt for every occasion you&apos;re about to ruin.
                </p>
              </div>
            </RevealText>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {[
                { 
                  title: "Corporate Satire", 
                  subtitle: "For the 9-5 dissenters",
                  href: "/collections/corporate" 
                },
                { 
                  title: "Internet Money", 
                  subtitle: "WAGMI (probably)",
                  href: "/collections/crypto" 
                },
                { 
                  title: "Tech Life", 
                  subtitle: "0 bugs, many opinions",
                  href: "/collections/tech" 
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
                    className="group block relative aspect-[4/3] sm:aspect-[4/3] rounded-xl overflow-hidden bg-card active:scale-[0.98] transition-transform"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-foreground mb-1 sm:mb-2 group-hover:text-primary group-active:text-primary transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-muted-foreground text-xs sm:text-sm">
                        {category.subtitle}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof / Quote Section */}
        <section className="py-12 sm:py-20 md:py-32 bg-card">
          <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
            <RevealText>
              <blockquote className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-medium text-foreground leading-relaxed mb-6 sm:mb-8">
                &ldquo;Finally, a brand that understands that having taste and 
                being insufferable aren&apos;t mutually exclusive.&rdquo;
              </blockquote>
            </RevealText>
            <RevealText delay={0.2}>
              <p className="text-sm sm:text-base text-muted-foreground">
                <span className="text-foreground font-medium">Anonymous Customer</span>
                {" "}&mdash; Verified Purchase, 5 Stars
              </p>
            </RevealText>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12 sm:py-20 md:py-32">
          <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
            <RevealText>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4 sm:mb-6">
                Ready to make a statement?
              </h2>
            </RevealText>
            <RevealText delay={0.1}>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
                Join the thousands of people who&apos;ve decided their wardrobe 
                should reflect their personality. For better or worse.
              </p>
            </RevealText>
            <RevealText delay={0.2}>
              <motion.div whileTap={{ scale: 0.98 }}>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-6 sm:px-8 py-4 bg-foreground text-background font-medium rounded-full hover:bg-foreground/90 active:bg-foreground/90 transition-colors"
                >
                  Shop All Shirts
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

export default function HomePage() {
  return (
    <CartProvider>
      <HomeContent />
    </CartProvider>
  );
}
