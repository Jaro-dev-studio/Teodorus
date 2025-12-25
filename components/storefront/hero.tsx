"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Cinematic Hero - Brand intro
 */
export function Hero() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-svh flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Subtle grain overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Ambient accent glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute inset-0"
      >
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-muted/30 blur-[120px]" />
      </motion.div>

      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 text-center"
      >
        {/* Entrance animation container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="space-y-8"
        >
          {/* Main headline - staggered reveal */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold text-foreground tracking-tight"
            >
              More Than
            </motion.h1>
          </div>
          <div className="overflow-hidden -mt-4">
            <motion.h1
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold tracking-tight"
            >
              <span className="text-muted-foreground">Meets the Eye</span>
            </motion.h1>
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed"
          >
            Thoughtfully crafted garments with a secret woven in.
            <br />
            <span className="text-foreground font-medium italic">If you know, you know.</span>
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="pt-4"
          >
            <Link
              href="#the-secret"
              className="inline-flex items-center gap-3 text-foreground hover:text-muted-foreground transition-colors group"
            >
              <span className="text-sm tracking-wider uppercase font-medium">Discover</span>
              <motion.svg
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
                strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
              </motion.svg>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/**
 * The Secret Reveal Section - Animated flip showing hidden message
 */
export function SecretReveal() {
  const [isRevealed, setIsRevealed] = React.useState(false);

  return (
    <section
      id="the-secret"
      className="relative py-24 sm:py-32 md:py-40 bg-secondary overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
              The Detail
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
              Look closer.
              <br />
              <span className="text-muted-foreground italic">Behind the neck.</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
              Each piece carries a hidden inscription - a quiet statement printed 
              where only the curious will find it. To most, it appears as refined simplicity. 
              To those who look closer, it reveals something more.
            </p>
          </motion.div>

          {/* Animated garment reveal */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div 
              className="relative aspect-3/4 max-w-md mx-auto perspective-1000 cursor-pointer group"
              onClick={() => setIsRevealed(!isRevealed)}
            >
              {/* Card container with 3D flip */}
              <motion.div
                className="relative w-full h-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: isRevealed ? 180 : 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Front - Garment exterior */}
                <div 
                  className="absolute inset-0 rounded-2xl bg-card border border-border overflow-hidden shadow-lg"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                    {/* Simplified hoodie illustration */}
                    <div className="relative w-full max-w-[280px]">
                      <svg viewBox="0 0 200 240" fill="none" className="w-full h-auto">
                        {/* Hoodie body */}
                        <path
                          d="M30 80 L30 220 C30 230 35 235 45 235 L155 235 C165 235 170 230 170 220 L170 80"
                          fill="var(--color-primary)"
                          stroke="var(--color-primary)"
                          strokeWidth="2"
                        />
                        {/* Hood */}
                        <path
                          d="M30 80 C30 40 60 15 100 15 C140 15 170 40 170 80 L150 80 C150 55 130 35 100 35 C70 35 50 55 50 80 Z"
                          fill="var(--color-primary)"
                          stroke="var(--color-primary)"
                          strokeWidth="2"
                        />
                        {/* Hood opening */}
                        <ellipse cx="100" cy="75" rx="35" ry="25" fill="var(--color-secondary)" />
                        {/* Pocket */}
                        <path
                          d="M60 150 L140 150 L140 190 C140 195 135 200 130 200 L70 200 C65 200 60 195 60 190 Z"
                          fill="none"
                          stroke="var(--color-secondary)"
                          strokeWidth="1.5"
                          opacity="0.4"
                        />
                        {/* Drawstrings */}
                        <line x1="85" y1="95" x2="85" y2="130" stroke="var(--color-secondary)" strokeWidth="1.5" opacity="0.5" />
                        <line x1="115" y1="95" x2="115" y2="130" stroke="var(--color-secondary)" strokeWidth="1.5" opacity="0.5" />
                      </svg>
                    </div>
                    <p className="mt-6 text-sm text-foreground font-medium">The Classic Hoodie</p>
                    
                    {/* Animated click prompt */}
                    <div className="mt-4 flex flex-col items-center gap-2">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.15, 1],
                          y: [0, -3, 0],
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="text-muted-foreground group-hover:text-foreground transition-colors"
                      >
                        <svg 
                          className="w-8 h-8" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor" 
                          strokeWidth={1.5}
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" 
                          />
                        </svg>
                      </motion.div>
                      <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                        Tap to reveal
                      </p>
                    </div>
                  </div>
                </div>

                {/* Back - Hidden message reveal */}
                <div 
                  className="absolute inset-0 rounded-2xl bg-primary overflow-hidden shadow-lg"
                  style={{ 
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)"
                  }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                    {/* Neck label illustration */}
                    <div className="relative">
                      {/* Label background */}
                      <div className="relative bg-primary-foreground/10 border border-primary-foreground/20 rounded-sm px-8 py-6">
                        <p className="text-[10px] tracking-[0.2em] uppercase text-primary-foreground/50 mb-2 text-center">
                          Behind the neck
                        </p>
                        <motion.p
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: isRevealed ? 1 : 0, scale: isRevealed ? 1 : 0.9 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                          className="text-lg sm:text-xl font-display italic text-primary-foreground text-center"
                        >
                          Tax Single Mothers
                        </motion.p>
              </div>
                      
                      {/* Stitching details */}
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-2 border-l border-r border-t border-dashed border-primary-foreground/20" />
          </div>

                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 10 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="mt-8 text-sm text-primary-foreground/70 text-center max-w-[200px]"
                    >
                      A cheeky detail for those who look.
                    </motion.p>
                    <p className="absolute bottom-6 text-xs text-primary-foreground/40 group-hover:text-primary-foreground/60 transition-colors">
                      Tap to flip back
                  </p>
                </div>
              </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * Craft Section
 */
export function PremiumQuality() {
  const features = [
    {
      title: "380gsm Organic Cotton",
      description: "Heavyweight brushed fleece with a structured drape. Pre-shrunk and garment-dyed for lasting color.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
        </svg>
      ),
    },
    {
      title: "The Hidden Inscription",
      description: "Printed at the interior neckline. A private detail between you and those who notice.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 md:py-40 bg-background overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-primary/5 to-transparent pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-20"
        >
          <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Materials & Craft
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground">
            Built to last.
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-8 sm:gap-12 max-w-2xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground mb-6"
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-lg sm:text-xl font-display font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * If You Know Section - Community/Insider feel
 */
export function IfYouKnow() {
  const messages = [
    "I didn't choose chaos",
    "Allergic to mornings",
    "Running on audacity",
    "Professional overthinker",
    "Touch grass, peasant",
    "Wrong timeline",
  ];

  return (
    <section className="relative py-24 sm:py-32 md:py-40 bg-secondary overflow-hidden">
      {/* Floating messages in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.12, 0.12, 0],
              x: [0, 20, -20, 0],
            }}
            transition={{
              duration: 8,
              delay: index * 1.5,
              repeat: Infinity,
              repeatDelay: messages.length * 1.5,
            }}
            className="absolute font-display italic text-muted-foreground whitespace-nowrap"
            style={{
              top: `${15 + (index * 15)}%`,
              left: `${10 + (index % 3) * 30}%`,
              fontSize: `${14 + (index % 3) * 4}px`,
            }}
          >
            &ldquo;{message}&rdquo;
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">
            For those who get it
          </p>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-8 leading-tight">
            If you know,
            <br />
            <span className="italic">you know.</span>
          </h2>
          
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12">
            To the world, refined simplicity. To those who notice, a shared understanding. 
            The message is there for those who care to look.
          </p>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary-hover transition-colors"
            >
              <span>Explore the Collection</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}