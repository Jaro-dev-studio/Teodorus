"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  once?: boolean;
  tag?: "h1" | "h2" | "h3" | "p" | "span";
}

/**
 * Animated text component with staggered word reveal
 */
export function AnimatedText({
  text,
  className,
  delay = 0,
  staggerDelay = 0.05,
  once = true,
  tag: Tag = "p",
}: AnimatedTextProps) {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className={cn("flex flex-wrap", className)}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="mr-[0.25em] inline-block"
          variants={child}
        >
          <Tag className="inline">{word}</Tag>
        </motion.span>
      ))}
    </motion.div>
  );
}

interface AnimatedHeadlineProps {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
}

/**
 * Animated headline with line-by-line reveal
 */
export function AnimatedHeadline({
  lines,
  className,
  lineClassName,
  delay = 0,
}: AnimatedHeadlineProps) {
  return (
    <div className={className}>
      {lines.map((line, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40, clipPath: "inset(0 0 100% 0)" }}
          animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
          transition={{
            duration: 0.8,
            delay: delay + index * 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={cn("overflow-hidden", lineClassName)}
        >
          <span className="block">{line}</span>
        </motion.div>
      ))}
    </div>
  );
}

interface RevealTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Simple reveal animation for any content
 */
export function RevealText({ children, className, delay = 0 }: RevealTextProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface CharacterRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

/**
 * Character-by-character reveal for dramatic effect
 */
export function CharacterReveal({ text, className, delay = 0 }: CharacterRevealProps) {
  const characters = text.split("");

  return (
    <motion.span
      initial="hidden"
      animate="visible"
      className={className}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.02,
            delayChildren: delay,
          },
        },
      }}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                type: "spring" as const,
                damping: 12,
                stiffness: 200,
              },
            },
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
