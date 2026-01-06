/**
 * Shopify Admin API Client
 * 
 * Used to fetch data not available via Storefront API,
 * such as image-to-variant associations.
 * 
 * Setup:
 * 1. Go to Shopify Admin -> Settings -> Apps and sales channels -> Develop apps
 * 2. Create or select your app
 * 3. Configure Admin API scopes (need read_products at minimum)
 * 4. Install app and copy the Admin API access token
 * 5. Set SHOPIFY_ADMIN_ACCESS_TOKEN in .env.local
 */

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

function getAdminEndpoint(path: string): string {
  if (!domain) {
    throw new Error("NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not configured");
  }
  return `https://${domain}/admin/api/2024-01${path}`;
}

export function isAdminApiConfigured(): boolean {
  return Boolean(domain && adminAccessToken);
}

interface ShopifyAdminImage {
  id: number;
  product_id: number;
  position: number;
  created_at: string;
  updated_at: string;
  alt: string | null;
  width: number;
  height: number;
  src: string;
  variant_ids: number[];
}

interface ShopifyAdminImagesResponse {
  images: ShopifyAdminImage[];
}

/**
 * Fetch all images for a product with their variant associations
 */
export async function getProductImagesWithVariants(productId: string): Promise<ShopifyAdminImage[]> {
  if (!isAdminApiConfigured()) {
    console.warn("[ShopifyAdmin] Admin API not configured, cannot fetch image-variant associations");
    return [];
  }

  // Extract numeric ID from Shopify GID format (gid://shopify/Product/123456789)
  const numericId = productId.replace(/^gid:\/\/shopify\/Product\//, "");
  
  console.log("[ShopifyAdmin] Fetching images for product:", numericId);

  try {
    const response = await fetch(getAdminEndpoint(`/products/${numericId}/images.json`), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminAccessToken!,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("[ShopifyAdmin] Error fetching images:", response.status, response.statusText);
      return [];
    }

    const data: ShopifyAdminImagesResponse = await response.json();
    console.log("[ShopifyAdmin] Found", data.images.length, "images total");
    
    // Debug: log images with and without variant associations
    const imagesWithVariants = data.images.filter(img => img.variant_ids.length > 0);
    const imagesWithoutVariants = data.images.filter(img => img.variant_ids.length === 0);
    console.log("[ShopifyAdmin] Images WITH variant_ids:", imagesWithVariants.length);
    console.log("[ShopifyAdmin] Images WITHOUT variant_ids:", imagesWithoutVariants.length);
    
    // Log first few images with their variant counts
    console.log("[ShopifyAdmin] Sample images:", data.images.slice(0, 5).map(img => ({
      position: img.position,
      variant_ids_count: img.variant_ids.length,
      variant_ids: img.variant_ids.slice(0, 3),
      src_end: img.src.slice(-40)
    })));
    
    return data.images;
  } catch (error) {
    console.error("[ShopifyAdmin] Fetch error:", error);
    return [];
  }
}

/**
 * Build a map of variant ID -> array of image URLs
 */
export async function getImagesByVariantId(productId: string): Promise<Map<string, string[]>> {
  const images = await getProductImagesWithVariants(productId);
  const map = new Map<string, string[]>();
  
  for (const image of images) {
    for (const variantId of image.variant_ids) {
      const key = `gid://shopify/ProductVariant/${variantId}`;
      const existing = map.get(key) || [];
      existing.push(image.src);
      map.set(key, existing);
    }
  }
  
  console.log("[ShopifyAdmin] Built variant->images map with", map.size, "variants");
  
  return map;
}

/**
 * Build a map of color name -> array of image URLs
 * Uses variant data to determine which images belong to which color
 * Also includes unassociated images based on position ordering
 */
export async function getImagesByColor(
  productId: string,
  variants: Array<{ id: string; color: string | null }>
): Promise<Record<string, string[]>> {
  const allImages = await getProductImagesWithVariants(productId);
  const colorImages: Record<string, string[]> = {};
  
  // Separate images with and without variant associations
  const imagesWithVariants = allImages.filter(img => img.variant_ids.length > 0);
  const imagesWithoutVariants = allImages.filter(img => img.variant_ids.length === 0);
  
  // Build a map of variant ID -> color
  const variantToColor = new Map<number, string>();
  for (const variant of variants) {
    if (!variant.color) continue;
    // Extract numeric ID from GID
    const numericId = parseInt(variant.id.replace(/^gid:\/\/shopify\/ProductVariant\//, ""), 10);
    variantToColor.set(numericId, variant.color);
  }
  
  // Determine color order from the main swatch images (those with variant_ids)
  // Sort by position to get consistent ordering
  const sortedMainImages = [...imagesWithVariants].sort((a, b) => a.position - b.position);
  const colorOrder: string[] = [];
  const mainImageByColor: Record<string, string> = {};
  
  for (const img of sortedMainImages) {
    // Get the color from the first variant this image is associated with
    for (const variantId of img.variant_ids) {
      const color = variantToColor.get(variantId);
      if (color && !colorOrder.includes(color)) {
        colorOrder.push(color);
        mainImageByColor[color] = img.src;
        break;
      }
    }
  }
  
  console.log("[ShopifyAdmin] Color order from main images:", colorOrder);
  console.log("[ShopifyAdmin] Unassociated images count:", imagesWithoutVariants.length);
  
  // Initialize colorImages with main swatch images
  for (const color of colorOrder) {
    colorImages[color] = [mainImageByColor[color]];
  }
  
  // Distribute unassociated images among colors based on position ordering
  // Assumption: additional images are uploaded in order, grouped by color
  if (imagesWithoutVariants.length > 0 && colorOrder.length > 0) {
    // Sort unassociated images by position
    const sortedUnassociated = [...imagesWithoutVariants].sort((a, b) => a.position - b.position);
    
    // Calculate how many additional images per color
    const additionalPerColor = Math.floor(sortedUnassociated.length / colorOrder.length);
    const remainder = sortedUnassociated.length % colorOrder.length;
    
    console.log("[ShopifyAdmin] Additional images per color:", additionalPerColor, "remainder:", remainder);
    
    let imageIndex = 0;
    for (let colorIndex = 0; colorIndex < colorOrder.length; colorIndex++) {
      const color = colorOrder[colorIndex];
      // Each color gets additionalPerColor images, plus 1 extra if in the remainder
      const count = additionalPerColor + (colorIndex < remainder ? 1 : 0);
      
      for (let i = 0; i < count && imageIndex < sortedUnassociated.length; i++) {
        colorImages[color].push(sortedUnassociated[imageIndex].src);
        imageIndex++;
      }
    }
  }
  
  console.log("[ShopifyAdmin] Final color->images map:", Object.keys(colorImages).map(c => `${c}: ${colorImages[c].length} images`));
  
  return colorImages;
}

