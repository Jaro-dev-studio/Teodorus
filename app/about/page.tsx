"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navigation, Footer, CartDrawer } from "@/components/storefront";
import { AnimatedHeadline, RevealText } from "@/components/storefront/animated-text";
import { CartProvider, useCart } from "@/components/storefront/cart-drawer";

function AboutContent() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, openCart } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Navigation cartItemCount={items.length} onCartClick={openCart} />

      <main className="pt-14 sm:pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="py-16 sm:py-24 md:py-32">
          <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
            <RevealText>
              <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4 sm:mb-6">
                Our Story
              </p>
            </RevealText>
            
            <AnimatedHeadline
              lines={["We make shirts", "for people who", "get it."]}
              delay={0.2}
              lineClassName="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-[1.1]"
            />

            <RevealText delay={0.8}>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mt-6 sm:mt-8 max-w-2xl mx-auto leading-relaxed">
                TriggerTs started with a simple idea: what if your wardrobe 
                could be as sharp as your wit?
              </p>
            </RevealText>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-12 sm:py-20 md:py-32 bg-secondary">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <RevealText>
                <div className="aspect-[4/3] rounded-xl sm:rounded-2xl bg-card overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-6xl sm:text-8xl font-display font-bold text-foreground/[0.03] sm:text-foreground/5">
                      2024
                    </p>
                  </div>
                </div>
              </RevealText>

              <RevealText delay={0.2}>
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground">
                    Born from the internet,
                    <br />
                    <span className="text-gradient">built for the bold.</span>
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    We noticed something: the smartest, most successful people we knew 
                    all had one thing in common. They could laugh at the absurdity of 
                    it all while still playing to win.
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    They weren&apos;t edgy for attention. They were sharp because they 
                    saw things clearly. They had opinions because they&apos;d done the work.
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    TriggerTs is for them. Premium quality t-shirts with statements 
                    that might make someone uncomfortable. That&apos;s the point.
                  </p>
                </div>
              </RevealText>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-12 sm:py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <RevealText>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground text-center mb-8 sm:mb-12 md:mb-16">
                What we believe
              </h2>
            </RevealText>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  title: "Quality over quantity",
                  description: "Every shirt is made with 100% organic cotton, ethically sourced and built to last. Because looking good and doing good aren't mutually exclusive.",
                },
                {
                  title: "Smart, not edgy",
                  description: "We're not here to shock. We're here to make you smirk. There's a difference between clever and crude, and we know which side we're on.",
                },
                {
                  title: "Internet native",
                  description: "We speak the language of the chronically online because that's where the interesting people are. IYKYK.",
                },
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="p-6 sm:p-8 rounded-xl bg-card"
                >
                  <h3 className="text-lg sm:text-xl font-display font-bold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-20 md:py-32 bg-card">
          <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
            <RevealText>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-4 sm:mb-6">
                Ready to make a statement?
              </h2>
            </RevealText>
            <RevealText delay={0.1}>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto">
                Browse our collection and find the perfect shirt for every 
                occasion you&apos;re about to disrupt.
              </p>
            </RevealText>
            <RevealText delay={0.2}>
              <motion.div whileTap={{ scale: 0.98 }}>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-6 sm:px-8 py-4 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary-hover active:bg-primary-hover transition-colors"
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

export default function AboutPage() {
  return (
    <CartProvider>
      <AboutContent />
    </CartProvider>
  );
}
