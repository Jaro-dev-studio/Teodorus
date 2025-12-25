"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedHeadline, RevealText } from "@/components/storefront/animated-text";

export default function AboutPage() {
  return (
    <div className="pt-12 sm:pt-14 md:pt-16">
      {/* Hero Section */}
      <section className="py-16 sm:py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <AnimatedHeadline
            lines={["Shirts for people", "who get it."]}
            delay={0.2}
            lineClassName="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-[1.1]"
          />

          <RevealText delay={0.6}>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mt-6 sm:mt-8 max-w-xl mx-auto leading-relaxed">
              Sharp wit deserves sharp style.
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
                  Born from the internet.
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  The smartest people we know share one thing: they can laugh at the absurdity while still playing to win.
                </p>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  TriggerTs is for them. Premium quality. Sharp opinions.
                </p>
              </div>
            </RevealText>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Quality",
                description: "100% organic cotton. Ethically sourced. Built to last.",
              },
              {
                title: "Smart",
                description: "Clever, not crude. There's a difference.",
              },
              {
                title: "Internet Native",
                description: "We speak the language. IYKYK.",
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
                <h3 className="text-lg sm:text-xl font-display font-bold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
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
            <motion.div whileTap={{ scale: 0.98 }}>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-6 sm:px-8 py-4 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary-hover active:bg-primary-hover transition-colors"
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
    </div>
  );
}
