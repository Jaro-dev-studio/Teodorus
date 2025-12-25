/**
 * Shopify Storefront API Client
 * 
 * Setup Options:
 * 
 * OPTION 1: Storefront API Access Token (recommended for public storefronts)
 * 1. Go to Shopify Admin -> Settings -> Apps and sales channels -> Develop apps
 * 2. Create app -> Configure Storefront API scopes
 * 3. Install app and copy the Storefront API access token
 * 4. Set NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local
 * 
 * OPTION 2: Headless Channel (for private access with client credentials)
 * 1. Go to Shopify Admin -> Sales channels -> Add sales channel -> Headless
 * 2. Create a new Headless channel/storefront
 * 3. Copy the Storefront API access token (or use client credentials for private access)
 * 4. Set the appropriate env variables
 * 
 * OPTION 3: Customer Account API (for customer authentication)
 * Uses separate client ID and secret for OAuth flows
 */

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Optional: For private/delegate access tokens
const privateAccessToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;

// For Customer Account API (OAuth)
const customerAccountClientId = process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID;
const customerAccountClientSecret = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET;

function getEndpoint(): string {
  if (!domain) {
    throw new Error("NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not configured");
  }
  return `https://${domain}/api/2024-01/graphql.json`;
}

function getAccessToken(): string {
  // Prefer private token if available (server-side only)
  if (privateAccessToken && typeof window === "undefined") {
    return privateAccessToken;
  }
  if (storefrontAccessToken) {
    return storefrontAccessToken;
  }
  throw new Error("No Shopify access token configured");
}

interface ShopifyResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

export async function shopifyFetch<T>({
  query,
  variables = {},
  cache = "no-store",
  tags,
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  tags?: string[];
}): Promise<T> {
  try {
    const endpoint = getEndpoint();
    const accessToken = getAccessToken();

    console.log("[Shopify] Fetching from:", endpoint);
    console.log("[Shopify] Variables:", JSON.stringify(variables));
    console.log("[Shopify] Access token (first 10 chars):", accessToken.substring(0, 10) + "...");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": accessToken,
      },
      body: JSON.stringify({ query, variables }),
      cache,
      next: tags ? { tags } : undefined,
    });

    console.log("[Shopify] Response status:", response.status);

    const body: ShopifyResponse<T> = await response.json();

    console.log("[Shopify] Response body:", JSON.stringify(body, null, 2));

    if (body.errors) {
      console.error("[Shopify] GraphQL errors:", body.errors);
      throw new Error(body.errors.map((e) => e.message).join("\n"));
    }

    return body.data;
  } catch (error) {
    console.error("[Shopify] Fetch error:", error);
    throw error;
  }
}

// Helper to check if Shopify is configured
export function isShopifyConfigured(): boolean {
  return Boolean(domain && (storefrontAccessToken || privateAccessToken));
}

// Export credentials for Customer Account API OAuth flows
export function getCustomerAccountCredentials() {
  return {
    clientId: customerAccountClientId,
    clientSecret: customerAccountClientSecret,
    domain,
  };
}
