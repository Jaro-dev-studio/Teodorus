"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navigation, Footer, CartDrawer } from "@/components/storefront";
import { RevealText } from "@/components/storefront/animated-text";
import { CartProvider, useCart } from "@/components/storefront/cart-drawer";

const collections = [
  {
    id: "classics",
    title: "Classics",
    subtitle: "The greatest hits. Statements that never go out of style.",
    description: "Our most popular shirts - the ones people can't stop asking about.",
    count: 2,
  },
  {
    id: "corporate",
    title: "Corporate Satire",
    subtitle: "For the 9-5 dissenters",
    description: "Perfect for your next meeting. Or your last day.",
    count: 2,
  },
  {
    id: "crypto",
    title: "Internet Money",
    subtitle: "WAGMI (probably)",
    description: "For those who made it, lost it, and are ready for round two.",
    count: 2,
  },
  {
    id: "tech",
    title: "Tech Life",
    subtitle: "0 bugs, many opinions",
    description: "Shirts for people who spend too much time on Twitter and Hacker News.",
    count: 1,
  },
  {
    id: "internet",
    title: "Internet Culture",
    subtitle: "If you know, you know",
    description: "For the chronically online. Touch grass? Maybe later.",
    count: 1,
  },
];

function CollectionsContent() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, openCart } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Navigation cartItemCount={items.length} onCartClick={openCart} />

      <main className="pt-14 sm:pt-16 md:pt-20">
        {/* Header */}
        <section className="py-12 sm:py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
            <RevealText>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4 sm:mb-6">
                Collections
              </h1>
            </RevealText>
            <RevealText delay={0.1}>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Browse by mood. Find the perfect statement for every situation 
                you&apos;re about to make uncomfortable.
              </p>
            </RevealText>
          </div>
        </section>

        {/* Collections Grid */}
        <section className="py-8 sm:py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {collections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link
                    href={`/shop?category=${collection.id}`}
                    className="group block relative aspect-[4/3] rounded-xl overflow-hidden bg-card active:scale-[0.98] transition-transform"
                  >
                    {/* Background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
                      <div className="space-y-2">
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground group-hover:text-primary group-active:text-primary transition-colors">
                          {collection.title}
                        </h2>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {collection.subtitle}
                        </p>
                        <p className="text-xs text-muted-foreground/70">
                          {collection.count} {collection.count === 1 ? 'product' : 'products'}
                        </p>
                      </div>
                    </div>

                    {/* Arrow indicator */}
                    <div className="absolute top-4 right-4 sm:top-5 sm:right-5 h-10 w-10 flex items-center justify-center rounded-full bg-secondary/80 text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-active:bg-primary group-active:text-primary-foreground transition-colors">
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
                    </div>
                  </Link>
                </motion.div>
              ))}

              {/* View All Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: collections.length * 0.1, duration: 0.5 }}
              >
                <Link
                  href="/shop"
                  className="group flex flex-col items-center justify-center aspect-[4/3] rounded-xl border-2 border-dashed border-border hover:border-primary active:border-primary transition-colors"
                >
                  <div className="text-center p-6">
                    <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                      <svg
                        className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      View All Products
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Browse everything
                    </p>
                  </div>
                </Link>
              </motion.div>
            </div>
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

export default function CollectionsPage() {
  return (
    <CartProvider>
      <CollectionsContent />
    </CartProvider>
  );
}
