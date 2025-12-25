"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/storefront/cart-drawer";
import { useWishlist } from "@/lib/context/wishlist-context";
import { RevealText } from "@/components/storefront/animated-text";
import { getProductByHandle } from "@/lib/shopify";
import type { Product } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

export default function ProductPage() {
  const params = useParams();
  const handle = params.handle as string;
  
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  
  const [product, setProduct] = React.useState<Product | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [isAdding, setIsAdding] = React.useState(false);

  React.useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const productData = await getProductByHandle(handle);
        setProduct(productData);
        if (productData?.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (handle) {
      fetchProduct();
    }
  }, [handle]);

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    
    setIsAdding(true);
    
    const variant = product.variants.find((v) => v.size === selectedSize) || product.variants[0];
    
    addItem({
      id: `${product.id}-${selectedSize}`,
      title: product.title,
      price: variant?.price || product.price,
      size: selectedSize,
      image: product.image || "",
    });
    
    setTimeout(() => setIsAdding(false), 500);
  };

  const isWishlisted = product ? isInWishlist(product.id) : false;

  if (isLoading) {
    return (
      <div className="pt-16 sm:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            <div className="aspect-[3/4] bg-secondary rounded-2xl animate-pulse" />
            <div className="space-y-6">
              <div className="h-10 w-3/4 bg-secondary rounded-lg animate-pulse" />
              <div className="h-6 w-1/2 bg-secondary rounded-lg animate-pulse" />
              <div className="h-24 bg-secondary rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-20 sm:pt-24 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">
            Product not found
          </h1>
          <Link href="/shop" className="text-primary hover:underline">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : [product.image].filter(Boolean) as string[];

  return (
    <div className="pt-16 sm:pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 sm:mb-8">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/shop" className="hover:text-foreground transition-colors">
                Shop
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">{product.title}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  {images[selectedImageIndex] ? (
                    <Image
                      src={images[selectedImageIndex]}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-6xl font-display font-bold text-foreground/5">
                        {product.title.charAt(0)}
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Wishlist button */}
              <button
                onClick={() => toggleItem(product.id)}
                className="absolute top-4 right-4 h-12 w-12 flex items-center justify-center rounded-full bg-foreground/80 backdrop-blur-sm transition-colors"
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <svg
                  className={cn(
                    "w-6 h-6 transition-colors",
                    isWishlisted ? "text-primary fill-primary" : "text-background"
                  )}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  fill={isWishlisted ? "currentColor" : "none"}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </button>

              {/* Sale badge */}
              {product.compareAtPrice && (
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-full">
                    Sale
                  </span>
                </div>
              )}
            </motion.div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "relative flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-colors",
                      selectedImageIndex === index
                        ? "border-primary"
                        : "border-transparent hover:border-border"
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
            <RevealText>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground">
                {product.title}
              </h1>
            </RevealText>

            {/* Price */}
            <RevealText delay={0.1}>
              <div className="flex items-center gap-4">
                <span className="text-2xl sm:text-3xl font-bold text-foreground">
                  ${product.price.toFixed(2)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.compareAtPrice.toFixed(2)}
                  </span>
                )}
                {product.compareAtPrice && (
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                    {Math.round((1 - product.price / product.compareAtPrice) * 100)}% off
                  </span>
                )}
              </div>
            </RevealText>

            {/* Description */}
            <RevealText delay={0.15}>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </RevealText>

            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <RevealText delay={0.2}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Size</span>
                    <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => {
                      const variant = product.variants.find((v) => v.size === size);
                      const isAvailable = variant?.availableForSale !== false;
                      
                      return (
                        <button
                          key={size}
                          onClick={() => isAvailable && setSelectedSize(size)}
                          disabled={!isAvailable}
                          className={cn(
                            "min-w-[48px] h-12 px-4 rounded-lg font-medium transition-all",
                            selectedSize === size
                              ? "bg-foreground text-background"
                              : isAvailable
                              ? "bg-secondary text-foreground hover:bg-secondary-hover"
                              : "bg-secondary/50 text-muted-foreground/50 cursor-not-allowed line-through"
                          )}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </RevealText>
            )}

            {/* Add to Cart */}
            <RevealText delay={0.25}>
              <div className="space-y-3 pt-4">
                <motion.button
                  onClick={handleAddToCart}
                  disabled={!product.availableForSale || !selectedSize || isAdding}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "w-full h-14 font-medium rounded-full transition-colors",
                    product.availableForSale && selectedSize
                      ? "bg-primary text-primary-foreground hover:bg-primary-hover"
                      : "bg-secondary text-muted-foreground cursor-not-allowed"
                  )}
                >
                  {!product.availableForSale
                    ? "Sold Out"
                    : isAdding
                    ? "Added!"
                    : "Add to Cart"}
                </motion.button>
              </div>
            </RevealText>

            {/* Product Details */}
            <RevealText delay={0.3}>
              <div className="border-t border-border pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-muted-foreground mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-foreground">Premium Quality</p>
                    <p className="text-sm text-muted-foreground">100% organic cotton</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-muted-foreground mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-foreground">Free Shipping</p>
                    <p className="text-sm text-muted-foreground">On orders over $100</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-muted-foreground mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-foreground">Easy Returns</p>
                    <p className="text-sm text-muted-foreground">30-day return policy</p>
                  </div>
                </div>
              </div>
            </RevealText>
          </div>
        </div>
      </div>
    </div>
  );
}
