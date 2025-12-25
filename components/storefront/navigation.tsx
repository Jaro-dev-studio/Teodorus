"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
];

interface NavigationProps {
  cartItemCount?: number;
  onCartClick?: () => void;
}

export function Navigation({ cartItemCount = 0, onCartClick }: NavigationProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
            : "bg-transparent"
        )}
      >
        {/* Safe area padding for notched devices */}
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 safe-area-inset-x">
          <div className="flex h-14 sm:h-16 md:h-20 items-center justify-between">
            {/* Logo */}
            <Link 
              href="/" 
              className="relative group min-h-[44px] flex items-center"
              aria-label="TriggerTs Home"
            >
              <motion.span
                className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-foreground">Trigger</span>
                <span className="text-gradient">Ts</span>
              </motion.span>
              <motion.div
                className="absolute -bottom-1 left-0 h-[2px] bg-primary hidden sm:block"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative group text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 py-2"
                >
                  <span>{link.label}</span>
                  <motion.span
                    className="absolute -bottom-1 left-0 h-[1px] bg-primary origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search button - visible on all sizes */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="h-11 w-11 sm:h-10 sm:w-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground active:bg-secondary sm:hover:bg-secondary transition-colors"
                aria-label="Search"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </motion.button>

              {/* Cart button - min 44px touch target */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onCartClick}
                className="relative h-11 w-11 sm:h-10 sm:w-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground active:bg-secondary sm:hover:bg-secondary transition-colors"
                aria-label={`Cart with ${cartItemCount} items`}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                <AnimatePresence>
                  {cartItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Mobile menu button - min 44px touch target */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden h-11 w-11 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground active:bg-secondary transition-colors"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                <div className="relative w-5 h-4 flex flex-col justify-between">
                  <motion.span
                    className="w-full h-[1.5px] bg-current origin-left"
                    animate={{
                      rotate: isMobileMenuOpen ? 45 : 0,
                      y: isMobileMenuOpen ? -1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span
                    className="w-full h-[1.5px] bg-current"
                    animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span
                    className="w-full h-[1.5px] bg-current origin-left"
                    animate={{
                      rotate: isMobileMenuOpen ? -45 : 0,
                      y: isMobileMenuOpen ? 1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </motion.button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu - Full screen */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu content - Full width on mobile */}
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute inset-0 bg-background flex flex-col px-6 pt-20 pb-8 safe-area-inset"
            >
              {/* Search bar on mobile */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <div className="relative">
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                  <input
                    type="search"
                    placeholder="Search products..."
                    className="w-full h-12 pl-12 pr-4 bg-secondary rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </motion.div>

              {/* Navigation links - Large touch targets */}
              <div className="flex-1 flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.15 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center h-14 text-2xl font-medium text-foreground hover:text-primary active:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Mobile CTA - Sticky at bottom */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-6 border-t border-border"
              >
                <Link
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full h-14 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary-hover active:scale-[0.98] transition-all"
                >
                  Browse Collection
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
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
