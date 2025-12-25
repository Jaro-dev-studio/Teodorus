"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedHeadline, RevealText } from "./animated-text";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Floating accent elements - hidden on mobile for performance */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="hidden sm:block absolute top-1/4 right-[10%] w-48 md:w-64 h-48 md:h-64 rounded-full bg-primary/5 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.7 }}
        className="hidden sm:block absolute bottom-1/4 left-[10%] w-64 md:w-96 h-64 md:h-96 rounded-full bg-accent/5 blur-3xl"
      />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
        {/* Main headline - Mobile-first sizing */}
        <AnimatedHeadline
          lines={[
            "Wear Your",
            "Opinion."
          ]}
          delay={0.2}
          className="mb-6 sm:mb-8"
          lineClassName="text-[2.75rem] leading-[1] sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold tracking-tight"
        />

        {/* Tagline - Better mobile line height */}
        <RevealText delay={0.8}>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-xs sm:max-w-lg md:max-w-xl mx-auto mb-8 sm:mb-12 leading-relaxed px-2">
            Premium t-shirts for people who get it.
          </p>
        </RevealText>

        {/* CTA buttons - Stack on mobile, row on larger */}
        <RevealText delay={1}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
            <motion.div 
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Link
                href="/shop"
                className="group flex items-center justify-center gap-3 w-full sm:w-auto px-6 sm:px-8 py-4 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary-hover active:bg-primary-hover transition-colors"
              >
                <span>Shop Now</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
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

        {/* Scroll indicator - Hidden on small mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="hidden sm:flex absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

/**
 * Alternative hero with product showcase
 */
export function HeroWithProduct() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/30" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-20 items-center">
          {/* Text content */}
          <div className="text-center lg:text-left">
            <RevealText delay={0.2}>
              <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                New Collection
              </span>
            </RevealText>

            <AnimatedHeadline
              lines={["Quiet Luxury.", "Loud Opinions."]}
              delay={0.4}
              lineClassName="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold tracking-tight leading-[1.1]"
            />

            <RevealText delay={0.9}>
              <p className="text-base sm:text-lg text-muted-foreground mt-4 sm:mt-6 mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
                Premium t-shirts for people who get it.
              </p>
            </RevealText>

            <RevealText delay={1.1}>
              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3 sm:gap-4">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-foreground text-background font-medium rounded-full hover:bg-foreground/90 active:scale-[0.98] transition-all"
                >
                  Shop Now
                </Link>
                <Link
                  href="/collections"
                  className="text-muted-foreground hover:text-foreground transition-colors animated-underline py-2"
                >
                  View Collections
                </Link>
              </div>
            </RevealText>
          </div>

          {/* Product preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-8 lg:mt-0"
          >
            <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] rounded-2xl overflow-hidden bg-secondary glow-gold">
              {/* Placeholder for product image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <p className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground/10 mb-2">
                    TriggerTs
                  </p>
                </div>
              </div>
            </div>

            {/* Floating badge - Adjust position on mobile */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute -right-2 sm:-right-4 top-6 sm:top-8 px-3 sm:px-4 py-1.5 sm:py-2 bg-accent text-accent-foreground text-xs sm:text-sm font-bold rounded-full shadow-lg"
            >
              Bestseller
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
