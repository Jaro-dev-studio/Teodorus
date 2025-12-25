/**
 * Shopify Storefront API Functions
 */

import { shopifyFetch, isShopifyConfigured } from "./client";
import * as queries from "./queries";
import type {
  Product,
  ProductVariant,
  Collection,
  ShopifyProduct,
  ShopifyCollection,
  Customer,
} from "./types";

// Check configuration
export { isShopifyConfigured };

// Normalize Shopify product to our Product type
function normalizeProduct(shopifyProduct: ShopifyProduct): Product {
  const variants = shopifyProduct.variants?.edges?.map((e) => e.node) || [];
  
  // Extract sizes and colors from variants
  const sizes = new Set<string>();
  const colors = new Set<string>();
  
  variants.forEach((variant) => {
    variant.selectedOptions?.forEach((opt) => {
      if (opt.name.toLowerCase() === "size") {
        sizes.add(opt.value);
      }
      if (opt.name.toLowerCase() === "color") {
        colors.add(opt.value);
      }
    });
  });

  const minPrice = parseFloat(shopifyProduct.priceRange?.minVariantPrice?.amount || "0");
  const compareAtPrice = shopifyProduct.compareAtPriceRange?.minVariantPrice?.amount
    ? parseFloat(shopifyProduct.compareAtPriceRange.minVariantPrice.amount)
    : null;

  return {
    id: shopifyProduct.id,
    handle: shopifyProduct.handle,
    title: shopifyProduct.title,
    description: shopifyProduct.description || "",
    descriptionHtml: shopifyProduct.descriptionHtml || "",
    price: minPrice,
    compareAtPrice: compareAtPrice && compareAtPrice > minPrice ? compareAtPrice : null,
    currencyCode: shopifyProduct.priceRange?.minVariantPrice?.currencyCode || "USD",
    image: shopifyProduct.featuredImage?.url || null,
    images: shopifyProduct.images?.edges?.map((e) => e.node.url) || [],
    tags: shopifyProduct.tags || [],
    productType: shopifyProduct.productType || "",
    availableForSale: shopifyProduct.availableForSale ?? true,
    variants: variants.map((v): ProductVariant => ({
      id: v.id,
      title: v.title,
      availableForSale: v.availableForSale ?? true,
      price: parseFloat(v.price?.amount || String(minPrice)),
      compareAtPrice: v.compareAtPrice ? parseFloat(v.compareAtPrice.amount) : null,
      size: v.selectedOptions?.find((o) => o.name.toLowerCase() === "size")?.value || null,
      color: v.selectedOptions?.find((o) => o.name.toLowerCase() === "color")?.value || null,
      image: v.image?.url || null,
    })),
    sizes: Array.from(sizes),
    colors: Array.from(colors),
  };
}

// Get all products
export async function getProducts(options?: {
  first?: number;
  sortKey?: "BEST_SELLING" | "PRICE" | "CREATED_AT" | "TITLE";
  reverse?: boolean;
}): Promise<Product[]> {
  console.log("[Shopify] getProducts called");
  console.log("[Shopify] isShopifyConfigured:", isShopifyConfigured());
  console.log("[Shopify] NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN:", process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN);
  console.log("[Shopify] NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN exists:", !!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN);
  
  if (!isShopifyConfigured()) {
    console.warn("[Shopify] Not configured, returning empty products");
    return [];
  }

  const { first = 50, sortKey = "BEST_SELLING", reverse = false } = options || {};

  console.log("[Shopify] Fetching products with options:", { first, sortKey, reverse });

  const data = await shopifyFetch<{
    products: {
      edges: Array<{ node: ShopifyProduct }>;
    };
  }>({
    query: queries.GET_PRODUCTS,
    variables: { first, sortKey, reverse },
    cache: "no-store",
  });

  console.log("[Shopify] Raw products count:", data.products?.edges?.length ?? 0);
  console.log("[Shopify] Product titles:", data.products?.edges?.map((e) => e.node.title) ?? []);
  
  const products = data.products.edges.map((e) => normalizeProduct(e.node));
  console.log("[Shopify] Normalized products:", products.length);
  
  return products;
}

// Get products by collection
export async function getCollectionProducts(
  handle: string,
  options?: {
    first?: number;
    sortKey?: "BEST_SELLING" | "PRICE" | "CREATED_AT" | "TITLE" | "COLLECTION_DEFAULT";
    reverse?: boolean;
  }
): Promise<{ collection: Collection | null; products: Product[] }> {
  if (!isShopifyConfigured()) {
    return { collection: null, products: [] };
  }

  const { first = 50, sortKey = "BEST_SELLING", reverse = false } = options || {};

  const data = await shopifyFetch<{
    collection: ShopifyCollection | null;
  }>({
    query: queries.GET_COLLECTION_PRODUCTS,
    variables: { handle, first, sortKey, reverse },
    cache: "no-store",
  });

  if (!data.collection) {
    return { collection: null, products: [] };
  }

  const products = data.collection.products.edges.map((e) => normalizeProduct(e.node));
  
  return {
    collection: {
      id: data.collection.id,
      handle: data.collection.handle,
      title: data.collection.title,
      description: data.collection.description,
      image: data.collection.image?.url || null,
      products,
    },
    products,
  };
}

// Get single product
export async function getProductByHandle(handle: string): Promise<Product | null> {
  if (!isShopifyConfigured()) {
    return null;
  }

  const data = await shopifyFetch<{
    product: ShopifyProduct | null;
  }>({
    query: queries.GET_PRODUCT_BY_HANDLE,
    variables: { handle },
    cache: "no-store",
  });

  if (!data.product) {
    return null;
  }

  return normalizeProduct(data.product);
}

// Get products by IDs (for wishlist)
export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (!isShopifyConfigured() || ids.length === 0) {
    return [];
  }

  const data = await shopifyFetch<{
    nodes: (ShopifyProduct | null)[];
  }>({
    query: queries.GET_PRODUCTS_BY_IDS,
    variables: { ids },
    cache: "no-store",
  });

  return data.nodes
    .filter((node): node is ShopifyProduct => node !== null)
    .map(normalizeProduct);
}

// Search products
export async function searchProducts(query: string, first = 20): Promise<Product[]> {
  if (!isShopifyConfigured() || !query.trim()) {
    return [];
  }

  const data = await shopifyFetch<{
    search: {
      edges: Array<{ node: ShopifyProduct }>;
    };
  }>({
    query: queries.SEARCH_PRODUCTS,
    variables: { query, first },
    cache: "no-store",
  });

  return data.search.edges.map((e) => normalizeProduct(e.node));
}

// Get all collections
export async function getCollections(): Promise<Omit<Collection, "products">[]> {
  console.log("[Shopify] getCollections called");
  
  if (!isShopifyConfigured()) {
    console.warn("[Shopify] Not configured, returning empty collections");
    return [];
  }

  const data = await shopifyFetch<{
    collections: {
      edges: Array<{
        node: {
          id: string;
          handle: string;
          title: string;
          description: string;
          image: { url: string } | null;
        };
      }>;
    };
  }>({
    query: queries.GET_COLLECTIONS,
    cache: "no-store",
  });

  console.log("[Shopify] Raw collections count:", data.collections?.edges?.length ?? 0);

  return data.collections.edges.map((e) => ({
    id: e.node.id,
    handle: e.node.handle,
    title: e.node.title,
    description: e.node.description,
    image: e.node.image?.url || null,
  }));
}

// Customer authentication
export async function customerLogin(
  email: string,
  password: string
): Promise<{ accessToken: string; expiresAt: string } | { error: string }> {
  if (!isShopifyConfigured()) {
    return { error: "Shopify not configured" };
  }

  const data = await shopifyFetch<{
    customerAccessTokenCreate: {
      customerAccessToken: { accessToken: string; expiresAt: string } | null;
      customerUserErrors: Array<{ message: string }>;
    };
  }>({
    query: queries.CUSTOMER_ACCESS_TOKEN_CREATE,
    variables: { input: { email, password } },
    cache: "no-store",
  });

  if (data.customerAccessTokenCreate.customerUserErrors.length > 0) {
    return { error: data.customerAccessTokenCreate.customerUserErrors[0].message };
  }

  if (!data.customerAccessTokenCreate.customerAccessToken) {
    return { error: "Failed to create access token" };
  }

  return data.customerAccessTokenCreate.customerAccessToken;
}

export async function customerRegister(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}): Promise<{ customer: Customer } | { error: string }> {
  if (!isShopifyConfigured()) {
    return { error: "Shopify not configured" };
  }

  const data = await shopifyFetch<{
    customerCreate: {
      customer: { id: string; email: string; firstName: string | null; lastName: string | null } | null;
      customerUserErrors: Array<{ message: string }>;
    };
  }>({
    query: queries.CUSTOMER_CREATE,
    variables: { input },
    cache: "no-store",
  });

  if (data.customerCreate.customerUserErrors.length > 0) {
    return { error: data.customerCreate.customerUserErrors[0].message };
  }

  if (!data.customerCreate.customer) {
    return { error: "Failed to create customer" };
  }

  return {
    customer: {
      id: data.customerCreate.customer.id,
      email: data.customerCreate.customer.email,
      firstName: data.customerCreate.customer.firstName,
      lastName: data.customerCreate.customer.lastName,
      displayName: `${data.customerCreate.customer.firstName || ""} ${data.customerCreate.customer.lastName || ""}`.trim() || data.customerCreate.customer.email,
      phone: null,
    },
  };
}

export async function getCustomer(accessToken: string): Promise<Customer | null> {
  if (!isShopifyConfigured()) {
    return null;
  }

  try {
    const data = await shopifyFetch<{
      customer: {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        displayName: string;
        phone: string | null;
      } | null;
    }>({
      query: queries.GET_CUSTOMER,
      variables: { customerAccessToken: accessToken },
      cache: "no-store",
    });

    return data.customer;
  } catch {
    return null;
  }
}

export async function customerLogout(accessToken: string): Promise<boolean> {
  if (!isShopifyConfigured()) {
    return false;
  }

  try {
    await shopifyFetch({
      query: queries.CUSTOMER_ACCESS_TOKEN_DELETE,
      variables: { customerAccessToken: accessToken },
      cache: "no-store",
    });
    return true;
  } catch {
    return false;
  }
}

export async function customerRecover(email: string): Promise<{ success: boolean; error?: string }> {
  if (!isShopifyConfigured()) {
    return { success: false, error: "Shopify not configured" };
  }

  const data = await shopifyFetch<{
    customerRecover: {
      customerUserErrors: Array<{ message: string }>;
    };
  }>({
    query: queries.CUSTOMER_RECOVER,
    variables: { email },
    cache: "no-store",
  });

  if (data.customerRecover.customerUserErrors.length > 0) {
    return { success: false, error: data.customerRecover.customerUserErrors[0].message };
  }

  return { success: true };
}

