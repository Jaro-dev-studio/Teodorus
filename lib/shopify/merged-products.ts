/**
 * Merged Products Helper Functions
 * 
 * These functions handle the logic for merging products and filtering hidden products.
 */

import prisma from "@/lib/prisma";
import type { Product, ProductVariant } from "./types";

// Cache for merged products data to avoid repeated DB calls
let mergedProductsCache: {
  hiddenHandles: Set<string>;
  mergeMap: Map<string, string[]>; // primaryHandle -> secondaryHandles[]
  timestamp: number;
} | null = null;

const CACHE_TTL = 60 * 1000; // 1 minute cache

async function getMergedProductsData() {
  const now = Date.now();
  
  if (mergedProductsCache && now - mergedProductsCache.timestamp < CACHE_TTL) {
    return mergedProductsCache;
  }
  
  console.log("[MergedProducts] Refreshing merged products cache...");
  
  const mergedProducts = await prisma.mergedProduct.findMany();
  
  const hiddenHandles = new Set<string>();
  const mergeMap = new Map<string, string[]>();
  
  for (const mp of mergedProducts) {
    hiddenHandles.add(mp.secondaryHandle);
    
    const existing = mergeMap.get(mp.primaryHandle) || [];
    existing.push(mp.secondaryHandle);
    mergeMap.set(mp.primaryHandle, existing);
  }
  
  mergedProductsCache = {
    hiddenHandles,
    mergeMap,
    timestamp: now,
  };
  
  console.log("[MergedProducts] Cache refreshed:", hiddenHandles.size, "hidden products,", mergeMap.size, "primary products with merges");
  
  return mergedProductsCache;
}

/**
 * Filter out secondary (hidden) products from a product list
 */
export async function filterHiddenProducts(products: Product[]): Promise<Product[]> {
  const { hiddenHandles } = await getMergedProductsData();
  
  if (hiddenHandles.size === 0) {
    return products;
  }
  
  return products.filter((p) => !hiddenHandles.has(p.handle));
}

/**
 * Get the secondary product handles for a primary product
 */
export async function getSecondaryHandles(primaryHandle: string): Promise<string[]> {
  const { mergeMap } = await getMergedProductsData();
  return mergeMap.get(primaryHandle) || [];
}

/**
 * Check if a handle is a secondary (hidden) product and get its primary
 */
export async function getPrimaryForSecondary(secondaryHandle: string): Promise<string | null> {
  const mergedProducts = await prisma.mergedProduct.findFirst({
    where: { secondaryHandle },
    select: { primaryHandle: true },
  });
  
  return mergedProducts?.primaryHandle ?? null;
}

/**
 * Merge variants from secondary products into a primary product
 */
export function mergeProductVariants(
  primaryProduct: Product,
  secondaryProducts: Product[]
): Product {
  if (secondaryProducts.length === 0) {
    return primaryProduct;
  }
  
  console.log("[MergedProducts] Merging variants from", secondaryProducts.length, "secondary products into", primaryProduct.handle);
  
  // Collect all variants
  const allVariants: ProductVariant[] = [...primaryProduct.variants];
  
  // Collect all images
  const allImages: string[] = [...primaryProduct.images];
  
  // Collect all colors
  const allColors = new Set<string>(primaryProduct.colors);
  
  // Collect all sizes
  const allSizes = new Set<string>(primaryProduct.sizes);
  
  // Merge imagesByColor
  const mergedImagesByColor: Record<string, string[]> = { ...primaryProduct.imagesByColor };
  
  for (const secondary of secondaryProducts) {
    // Add variants from secondary product
    for (const variant of secondary.variants) {
      // Update variant to use primary product's pricing if needed
      // but keep the variant's own data for cart purposes
      allVariants.push({
        ...variant,
        // Keep original variant ID for cart/checkout
      });
      
      if (variant.color) {
        allColors.add(variant.color);
      }
      if (variant.size) {
        allSizes.add(variant.size);
      }
    }
    
    // Add images from secondary product
    for (const image of secondary.images) {
      if (!allImages.includes(image)) {
        allImages.push(image);
      }
    }
    
    // Merge imagesByColor from secondary product
    for (const [color, images] of Object.entries(secondary.imagesByColor)) {
      if (!mergedImagesByColor[color]) {
        mergedImagesByColor[color] = [];
      }
      for (const img of images) {
        if (!mergedImagesByColor[color].includes(img)) {
          mergedImagesByColor[color].push(img);
        }
      }
    }
  }
  
  return {
    ...primaryProduct,
    variants: allVariants,
    images: allImages,
    imagesByColor: mergedImagesByColor,
    colors: Array.from(allColors),
    sizes: Array.from(allSizes),
  };
}

/**
 * Invalidate the merged products cache (call after admin changes)
 */
export function invalidateMergedProductsCache() {
  mergedProductsCache = null;
}


