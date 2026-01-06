"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/storefront/cart-drawer";
import { useWishlist } from "@/lib/context/wishlist-context";
import { RevealText } from "@/components/storefront/animated-text";
import { ImageLightbox } from "@/components/storefront/image-lightbox";
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
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [isAdding, setIsAdding] = React.useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);
  
  const carouselRef = React.useRef<HTMLDivElement>(null);

  // Open lightbox with specific image
  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

  React.useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products/${handle}`);
        if (!res.ok) {
          if (res.status === 404) {
            setProduct(null);
            return;
          }
          throw new Error("Failed to fetch product");
        }
        const productData: Product = await res.json();
        setProduct(productData);
        if (productData?.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0]);
        }
        // Set first color as default if available
        if (productData?.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
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

  // Get images filtered by selected color
  const getFilteredImages = React.useCallback(() => {
    if (!product) return [];
    
    // Get all unique product images
    const allImages = product.images.length > 0 
      ? [...new Set(product.images)] 
      : [product.image].filter(Boolean) as string[];
    
    // If no colors or no color selected, show all images
    if (product.colors.length === 0 || !selectedColor) {
      return allImages;
    }
    
    // Use imagesByColor from Admin API if available (proper variant-image associations)
    if (product.imagesByColor && Object.keys(product.imagesByColor).length > 0) {
      const colorImages = product.imagesByColor[selectedColor];
      if (colorImages && colorImages.length > 0) {
        return colorImages;
      }
    }
    
    // Fallback: Get the variant image for the selected color
    const selectedColorVariant = product.variants.find((v) => v.color === selectedColor && v.image);
    const selectedColorImage = selectedColorVariant?.image;
    
    if (!selectedColorImage) {
      return allImages;
    }
    
    // Fallback: Return all images with the selected color's variant image first
    const otherImages = allImages.filter((img) => img !== selectedColorImage);
    return [selectedColorImage, ...otherImages];
  }, [product, selectedColor]);

  // Preload all product images when product loads
  React.useEffect(() => {
    if (!product) return;
    
    // Collect all unique image URLs from the product
    const allImages = new Set<string>();
    
    // Add main product images
    product.images.forEach((img) => allImages.add(img));
    if (product.image) allImages.add(product.image);
    
    // Add all variant images
    product.variants.forEach((variant) => {
      if (variant.image) allImages.add(variant.image);
    });
    
    // Preload each image
    allImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [product]);

  // Reset image index when color changes
  React.useEffect(() => {
    setSelectedImageIndex(0);
    // Also scroll carousel to start on mobile
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [selectedColor]);

  // Handle carousel scroll to update selected image index
  React.useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const width = carousel.offsetWidth;
      const newIndex = Math.round(scrollLeft / width);
      setSelectedImageIndex(newIndex);
    };

    carousel.addEventListener("scroll", handleScroll, { passive: true });
    return () => carousel.removeEventListener("scroll", handleScroll);
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAdding(true);
    
    // Find variant matching both size and color (if color is selected)
    let variant = product.variants.find((v) => {
      const sizeMatch = v.size === selectedSize;
      const colorMatch = !selectedColor || v.color === selectedColor;
      return sizeMatch && colorMatch;
    });
    
    // Fallback to just size match if no exact match
    if (!variant) {
      variant = product.variants.find((v) => v.size === selectedSize);
    }
    
    // Final fallback to first variant
    if (!variant) {
      variant = product.variants[0];
    }
    
    const images = getFilteredImages();
    
    addItem({
      id: `${product.id}${selectedSize ? `-${selectedSize}` : ""}${selectedColor ? `-${selectedColor}` : ""}`,
      variantId: variant?.id || product.variants[0]?.id,
      title: product.title,
      price: variant?.price || product.price,
      size: selectedSize || undefined,
      image: images[0] || product.image || "",
    });
    
    setTimeout(() => setIsAdding(false), 500);
  };

  const isWishlisted = product ? isInWishlist(product.id) : false;

  // Scroll to specific image in carousel
  const scrollToImage = (index: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const width = carousel.offsetWidth;
    carousel.scrollTo({ left: width * index, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="pt-14 sm:pt-20">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Mobile: Square image skeleton */}
          <div className="sm:hidden mb-4">
            <div className="aspect-square bg-secondary animate-pulse" />
          </div>
          {/* Desktop skeleton */}
          <div className="hidden sm:grid lg:grid-cols-2 gap-8 lg:gap-16">
            <div className="aspect-[3/4] bg-secondary rounded-2xl animate-pulse" />
            <div className="space-y-6">
              <div className="h-10 w-3/4 bg-secondary rounded-lg animate-pulse" />
              <div className="h-6 w-1/2 bg-secondary rounded-lg animate-pulse" />
              <div className="h-24 bg-secondary rounded-lg animate-pulse" />
            </div>
          </div>
          {/* Mobile skeleton content */}
          <div className="sm:hidden space-y-4 px-4">
            <div className="h-8 w-3/4 bg-secondary rounded-lg animate-pulse" />
            <div className="h-6 w-1/2 bg-secondary rounded-lg animate-pulse" />
            <div className="h-20 bg-secondary rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-20 sm:pt-24 flex items-center justify-center min-h-[60vh]">
        <div className="text-center px-4">
          <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-4">
            Product not found
          </h1>
          <Link href="/shop" className="text-primary hover:underline">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  // Use filtered images based on selected color
  const images = getFilteredImages();

  return (
    <div className="pt-14 sm:pt-20 pb-24 sm:pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Breadcrumb - hidden on mobile */}
        <nav className="hidden sm:block mb-6 sm:mb-8 px-4 sm:px-6 lg:px-8">
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
            <li className="text-foreground truncate max-w-[150px]">{product.title}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-0 sm:gap-8 lg:gap-16 sm:px-6 lg:px-8">
          {/* Product Images */}
          <div className="space-y-3 sm:space-y-4">
            {/* Mobile: Instagram-style horizontal carousel */}
            <div className="sm:hidden relative">
              <div
                ref={carouselRef}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => openLightbox(index)}
                    className="relative flex-shrink-0 w-full aspect-square snap-center bg-secondary cursor-zoom-in active:opacity-95 transition-opacity"
                    aria-label={`View ${product.title} image ${index + 1} fullscreen`}
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-6xl font-display font-bold text-foreground/5">
                          {product.title.charAt(0)}
                        </p>
                      </div>
                    )}
                    {/* Zoom hint icon */}
                    <div className="absolute bottom-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-foreground/70">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>

              {/* Mobile pagination dots */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToImage(index)}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        selectedImageIndex === index
                          ? "bg-foreground w-4"
                          : "bg-foreground/40 w-1.5"
                      )}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Wishlist button */}
              <button
                onClick={() => toggleItem(product.id)}
                className="absolute top-3 right-3 h-10 w-10 flex items-center justify-center rounded-full bg-background/90 backdrop-blur-sm shadow-sm transition-colors active:scale-95"
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <svg
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isWishlisted ? "text-primary fill-primary" : "text-muted-foreground"
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
                <div className="absolute top-3 left-3">
                  <span className="inline-block px-2.5 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    Sale
                  </span>
                </div>
              )}
            </div>

            {/* Desktop: Single image with thumbnails */}
            <motion.div
              className="hidden sm:block relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <button
                onClick={() => openLightbox(selectedImageIndex)}
                className="absolute inset-0 w-full h-full cursor-zoom-in"
                aria-label="Open image fullscreen"
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
                      <img
                        src={images[selectedImageIndex]}
                        alt={product.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
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

                {/* Zoom hint overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-14 w-14 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-foreground shadow-lg">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Wishlist button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(product.id);
                }}
                className="absolute top-4 right-4 z-10 h-12 w-12 flex items-center justify-center rounded-full bg-background/90 backdrop-blur-sm shadow-sm transition-colors hover:bg-background"
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <svg
                  className={cn(
                    "w-6 h-6 transition-colors",
                    isWishlisted ? "text-primary fill-primary" : "text-muted-foreground"
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
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-block px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-full">
                    Sale
                  </span>
                </div>
              )}
            </motion.div>

            {/* Desktop Thumbnail Images */}
            {images.length > 1 && (
              <div className="hidden sm:flex gap-3 overflow-x-auto scrollbar-hide pb-2">
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
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-4 sm:space-y-6 px-4 sm:px-0 pt-5 sm:pt-0">
            <RevealText>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground">
                {product.title}
              </h1>
            </RevealText>

            {/* Price */}
            <RevealText delay={0.1}>
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <span className="text-xl sm:text-3xl font-bold text-foreground">
                  ${product.price.toFixed(2)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-base sm:text-xl text-muted-foreground line-through">
                    ${product.compareAtPrice.toFixed(2)}
                  </span>
                )}
                {product.compareAtPrice && (
                  <span className="px-2.5 py-1 sm:px-3 bg-primary/10 text-primary text-xs sm:text-sm font-medium rounded-full">
                    {Math.round((1 - product.price / product.compareAtPrice) * 100)}% off
                  </span>
                )}
              </div>
            </RevealText>

            {/* Description */}
            {product.descriptionHtml && (
              <RevealText delay={0.15}>
                <div 
                  className="text-sm sm:text-base text-muted-foreground leading-relaxed prose prose-sm prose-neutral dark:prose-invert max-w-none
                    [&>p]:mb-3 [&>p:last-child]:mb-0
                    [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3
                    [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-3
                    [&>li]:mb-1
                    [&>h1]:text-lg [&>h1]:font-semibold [&>h1]:mb-2 [&>h1]:text-foreground
                    [&>h2]:text-base [&>h2]:font-semibold [&>h2]:mb-2 [&>h2]:text-foreground
                    [&>h3]:text-sm [&>h3]:font-semibold [&>h3]:mb-2 [&>h3]:text-foreground
                    [&>strong]:font-semibold [&>strong]:text-foreground
                    [&>a]:text-primary [&>a]:underline"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              </RevealText>
            )}

            {/* Color Selector - only show if multiple colors */}
            {product.colors.length > 1 && (
              <RevealText delay={0.2}>
                <div>
                  <span className="block text-sm font-medium text-foreground mb-3">Color</span>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {product.colors.map((color) => {
                      // Check if any variant with this color is available
                      const colorVariants = product.variants.filter((v) => v.color === color);
                      const isAvailable = colorVariants.some((v) => v.availableForSale !== false);
                      
                      return (
                        <button
                          key={color}
                          onClick={() => isAvailable && setSelectedColor(color)}
                          disabled={!isAvailable}
                          className={cn(
                            "h-11 sm:h-12 px-4 sm:px-5 rounded-lg font-medium transition-all active:scale-95 capitalize",
                            selectedColor === color
                              ? "bg-foreground text-background"
                              : isAvailable
                              ? "bg-secondary text-foreground hover:bg-secondary-hover"
                              : "bg-secondary/50 text-muted-foreground/50 cursor-not-allowed line-through"
                          )}
                        >
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </RevealText>
            )}

            {/* Size Selector - only show if multiple sizes */}
            {product.sizes.length > 1 && (
              <RevealText delay={0.25}>
                <div>
                  <span className="block text-sm font-medium text-foreground mb-3">Size</span>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {product.sizes.map((size) => {
                      // Check availability based on both size and selected color
                      const matchingVariants = product.variants.filter((v) => {
                        const sizeMatch = v.size === size;
                        const colorMatch = !selectedColor || v.color === selectedColor;
                        return sizeMatch && colorMatch;
                      });
                      const isAvailable = matchingVariants.some((v) => v.availableForSale !== false);
                      
                      return (
                        <button
                          key={size}
                          onClick={() => isAvailable && setSelectedSize(size)}
                          disabled={!isAvailable}
                          className={cn(
                            "min-w-[44px] sm:min-w-[48px] h-11 sm:h-12 px-3 sm:px-4 rounded-lg font-medium transition-all active:scale-95",
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

            {/* Add to Cart - Sticky on mobile */}
            <RevealText delay={0.3}>
              <div className="hidden sm:block space-y-3 pt-4">
                <motion.button
                  onClick={handleAddToCart}
                  disabled={!product.availableForSale || (product.sizes.length > 0 && !selectedSize) || isAdding}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "w-full h-14 font-medium rounded-full transition-colors",
                    product.availableForSale && (product.sizes.length === 0 || selectedSize)
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
            <RevealText delay={0.35}>
              <div className="border-t border-border pt-5 sm:pt-6 space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0"
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
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0"
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
                    <p className="text-xs sm:text-sm text-muted-foreground">On orders over $100</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0"
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
                    <p className="text-xs sm:text-sm text-muted-foreground">30-day return policy</p>
                  </div>
                </div>
              </div>
            </RevealText>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Add to Cart Button */}
      {product && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t border-border z-30">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="text-lg font-bold text-foreground">${product.price.toFixed(2)}</p>
            </div>
            <motion.button
              onClick={handleAddToCart}
              disabled={!product.availableForSale || (product.sizes.length > 0 && !selectedSize) || isAdding}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex-1 h-12 font-medium rounded-full transition-colors",
                product.availableForSale && (product.sizes.length === 0 || selectedSize)
                  ? "bg-primary text-primary-foreground active:bg-primary-hover"
                  : "bg-secondary text-muted-foreground cursor-not-allowed"
              )}
            >
              {!product.availableForSale
                ? "Sold Out"
                : isAdding
                ? "Added!"
                : product.sizes.length > 0 && !selectedSize
                ? "Select Size"
                : "Add to Cart"}
            </motion.button>
          </div>
        </div>
      )}

      {/* Fullscreen Image Lightbox */}
      <ImageLightbox
        images={images}
        initialIndex={selectedImageIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        productTitle={product.title}
      />
    </div>
  );
}
