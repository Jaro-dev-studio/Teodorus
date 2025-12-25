"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/context/auth-context";
import { useWishlist } from "@/lib/context/wishlist-context";
import { searchProducts, getCollections } from "@/lib/shopify";
import type { Product, Collection } from "@/lib/shopify/types";

interface NavigationProps {
  cartItemCount?: number;
  onCartClick?: () => void;
}

// Animation variants
const menuVariants = {
  closed: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const menuItemVariants = {
  closed: {
    opacity: 0,
    y: 40,
    transition: {
      duration: 0.3,
    },
  },
  open: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 + i * 0.08,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const collectionItemVariants = {
  closed: {
    opacity: 0,
    x: -20,
  },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.4 + i * 0.05,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const footerVariants = {
  closed: {
    opacity: 0,
    y: 20,
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.6,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function Navigation({ cartItemCount = 0, onCartClick }: NavigationProps) {
  const router = useRouter();
  const { isAuthenticated, customer } = useAuth();
  const { items: wishlistItems } = useWishlist();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<Product[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [collections, setCollections] = React.useState<Omit<Collection, "products">[]>([]);
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
  
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Fetch collections on mount
  React.useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await getCollections();
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };
    fetchCollections();
  }, []);

  // Lock body scroll when mobile menu or search is open
  React.useEffect(() => {
    if (isMobileMenuOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen, isSearchOpen]);

  // Focus search input when opened
  React.useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Real-time search with debounce
  React.useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchProducts(searchQuery, 8);
        setSearchResults(results);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const closeAllMenus = React.useCallback((withDelay = false) => {
    const close = () => {
      setIsMobileMenuOpen(false);
      setIsSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
      setHoveredItem(null);
    };
    
    if (withDelay) {
      // Delay closing to let navigation complete first
      setTimeout(close, 150);
    } else {
      close();
    }
  }, []);

  const mainNavItems = [
    { title: "Shop All", href: "/shop" },
    { title: "Collections", href: "/collections" },
    { title: "About", href: "/about" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background">
        <nav className="mx-auto max-w-[1800px] px-2 sm:px-6 lg:px-8">
          <div className="flex h-12 sm:h-14 md:h-16 items-center justify-between">
            {/* Left side - Hamburger + Search */}
            <div className="flex items-center gap-0 sm:gap-1">
              {/* Hamburger menu */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  if (isSearchOpen) setIsSearchOpen(false);
                }}
                className="h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center rounded-full text-foreground hover:bg-secondary active:bg-secondary transition-colors"
                aria-label="Menu"
                aria-expanded={isMobileMenuOpen}
              >
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <motion.span
                    className="absolute w-5 h-[1.5px] bg-current"
                    animate={{
                      rotate: isMobileMenuOpen ? 45 : 0,
                      y: isMobileMenuOpen ? 0 : -4,
                    }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <motion.span
                    className="absolute w-5 h-[1.5px] bg-current"
                    animate={{ 
                      opacity: isMobileMenuOpen ? 0 : 1,
                      scaleX: isMobileMenuOpen ? 0 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span
                    className="absolute w-5 h-[1.5px] bg-current"
                    animate={{
                      rotate: isMobileMenuOpen ? -45 : 0,
                      y: isMobileMenuOpen ? 0 : 4,
                    }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </motion.button>

              {/* Search button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                }}
                className="h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center rounded-full text-foreground hover:bg-secondary active:bg-secondary transition-colors"
                aria-label="Search"
              >
                <svg
                  className="h-[18px] w-[18px] sm:h-5 sm:w-5"
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
            </div>

            {/* Center - Logo */}
            <Link
              href="/"
              onClick={() => closeAllMenus(true)}
              className="absolute left-1/2 transform -translate-x-1/2 min-h-[40px] flex items-center"
              aria-label="TriggerTs Home"
            >
              <motion.span
                className="text-base sm:text-lg md:text-xl font-bold tracking-[0.1em] sm:tracking-[0.15em] uppercase"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-foreground">TRIGGER</span>
                <span className="text-gradient">TS</span>
              </motion.span>
            </Link>

            {/* Right side - Wishlist, Account, Cart */}
            <div className="flex items-center gap-0 sm:gap-1">
              {/* Wishlist */}
              <Link href="/wishlist" onClick={() => closeAllMenus(true)}>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="relative h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center rounded-full text-foreground hover:bg-secondary active:bg-secondary transition-colors"
                  aria-label={`Wishlist with ${wishlistItems.length} items`}
                >
                  <svg
                    className="h-[18px] w-[18px] sm:h-5 sm:w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                  <AnimatePresence>
                    {wishlistItems.length > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-0.5 -right-0.5 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                      >
                        {wishlistItems.length}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>

              {/* Account */}
              <Link href="/account" onClick={() => closeAllMenus(true)}>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center rounded-full text-foreground hover:bg-secondary active:bg-secondary transition-colors"
                  aria-label={isAuthenticated ? `Account: ${customer?.displayName}` : "Sign in"}
                >
                  <svg
                    className="h-[18px] w-[18px] sm:h-5 sm:w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </motion.div>
              </Link>

              {/* Cart */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onCartClick}
                className="relative h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center rounded-full text-foreground hover:bg-secondary active:bg-secondary transition-colors"
                aria-label={`Cart with ${cartItemCount} items`}
              >
                <svg
                  className="h-[18px] w-[18px] sm:h-5 sm:w-5"
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
            </div>
          </div>
        </nav>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/95 backdrop-blur-lg"
              onClick={() => setIsSearchOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative z-10 pt-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <svg
                  className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
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
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full h-14 pl-14 pr-14 bg-secondary rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-lg"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full hover:bg-background/50 transition-colors"
                  aria-label="Close search"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </form>

              {searchQuery.length >= 2 && (
                <div className="mt-6 bg-card rounded-2xl border border-border overflow-hidden max-h-[60vh] overflow-y-auto">
                  {isSearching ? (
                    <div className="p-8 text-center text-muted-foreground">
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="divide-y divide-border">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.handle}`}
                          onClick={() => closeAllMenus(true)}
                          className="flex items-center gap-4 p-4 hover:bg-secondary transition-colors"
                        >
                          <div className="w-16 h-20 rounded-lg bg-secondary flex-shrink-0 overflow-hidden">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-foreground/10 font-display text-sm">
                                TT
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground truncate">
                              {product.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              ${product.price.toFixed(2)} {product.currencyCode}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      No products found for &ldquo;{searchQuery}&rdquo;
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Page Menu */}
      {isMobileMenuOpen && (
        <motion.div
          variants={menuVariants}
          initial="closed"
          animate="open"
          className="fixed inset-0 z-40 bg-background"
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.03, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -right-1/4 top-1/4 w-[800px] h-[800px] rounded-full bg-primary"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.02, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -left-1/4 bottom-1/4 w-[600px] h-[600px] rounded-full bg-accent"
            />
          </div>

            {/* Menu content */}
            <div className="relative h-full flex flex-col pt-20 sm:pt-24 pb-8 px-6 sm:px-12 lg:px-20 overflow-y-auto">
              {/* Main navigation */}
              <div className="flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                  {/* Primary links */}
                  <div className="space-y-4">
                    {mainNavItems.map((item, i) => (
                      <motion.div
                        key={item.href}
                        custom={i}
                        variants={menuItemVariants}
                        initial="closed"
                        animate="open"
                        onMouseEnter={() => setHoveredItem(item.title)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <Link
                          href={item.href}
                          onClick={() => closeAllMenus(true)}
                          className="group block relative"
                        >
                          <span
                            className={cn(
                              "block text-5xl sm:text-6xl lg:text-7xl font-display font-bold transition-all duration-300",
                              hoveredItem && hoveredItem !== item.title
                                ? "text-muted-foreground/30"
                                : "text-foreground"
                            )}
                          >
                            {item.title}
                          </span>
                          <motion.div
                            className="absolute -bottom-2 left-0 h-[3px] bg-primary origin-left"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: hoveredItem === item.title ? 1 : 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Collections sidebar */}
                  {collections.length > 0 && (
                    <div className="lg:border-l lg:border-border lg:pl-12">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6"
                      >
                        Collections
                      </motion.p>
                      <div className="space-y-3">
                        {collections.slice(0, 6).map((collection, i) => (
                          <motion.div
                            key={collection.id}
                            custom={i}
                            variants={collectionItemVariants}
                            initial="closed"
                            animate="open"
                            onMouseEnter={() => setHoveredItem(collection.title)}
                            onMouseLeave={() => setHoveredItem(null)}
                          >
                            <Link
                              href={`/collections/${collection.handle}`}
                              onClick={() => closeAllMenus(true)}
                              className={cn(
                                "group flex items-center gap-3 text-lg sm:text-xl font-medium transition-all duration-300",
                                hoveredItem && hoveredItem !== collection.title
                                  ? "text-muted-foreground/40"
                                  : "text-foreground"
                              )}
                            >
                              <motion.span
                                className="w-2 h-2 rounded-full bg-primary"
                                animate={{
                                  scale: hoveredItem === collection.title ? 1.5 : 1,
                                }}
                                transition={{ duration: 0.2 }}
                              />
                              {collection.title}
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <motion.div
                variants={footerVariants}
                initial="closed"
                animate="open"
                className="mt-auto pt-12 border-t border-border"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    {isAuthenticated ? (
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {customer?.firstName?.charAt(0) || customer?.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {customer?.displayName}
                          </p>
                          <Link
                            href="/account"
                            onClick={() => closeAllMenus(true)}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            View Account
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <Link
                        href="/account"
                        onClick={() => closeAllMenus(true)}
                        className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium">Sign In</span>
                      </Link>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Link
                      href="/wishlist"
                      onClick={() => closeAllMenus(true)}
                      className="hover:text-foreground transition-colors"
                    >
                      Wishlist ({wishlistItems.length})
                    </Link>
                    <span className="text-border">|</span>
                    <button
                      onClick={() => {
                        closeAllMenus(false);
                        onCartClick?.();
                      }}
                      className="hover:text-foreground transition-colors"
                    >
                      Cart ({cartItemCount})
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
    </>
  );
}
