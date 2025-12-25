/**
 * Shopify Storefront API Types
 */

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: ShopifyPrice;
  compareAtPrice: ShopifyPrice | null;
  image: ShopifyImage | null;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  tags: string[];
  productType: string;
  vendor: string;
  availableForSale: boolean;
  featuredImage: ShopifyImage | null;
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  variants: {
    edges: Array<{
      node: ShopifyProductVariant;
    }>;
  };
  priceRange: {
    minVariantPrice: ShopifyPrice;
    maxVariantPrice: ShopifyPrice;
  };
  compareAtPriceRange: {
    minVariantPrice: ShopifyPrice;
    maxVariantPrice: ShopifyPrice;
  };
  seo: {
    title: string | null;
    description: string | null;
  };
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyPrice;
    totalAmount: ShopifyPrice;
    totalTaxAmount: ShopifyPrice | null;
  };
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          selectedOptions: {
            name: string;
            value: string;
          }[];
          product: {
            id: string;
            handle: string;
            title: string;
            featuredImage: ShopifyImage | null;
          };
          price: ShopifyPrice;
        };
      };
    }>;
  };
}

export interface ShopifyCustomer {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
  phone: string | null;
  acceptsMarketing: boolean;
  createdAt: string;
  defaultAddress: ShopifyAddress | null;
  addresses: {
    edges: Array<{
      node: ShopifyAddress;
    }>;
  };
  orders: {
    edges: Array<{
      node: ShopifyOrder;
    }>;
  };
}

export interface ShopifyAddress {
  id: string;
  address1: string | null;
  address2: string | null;
  city: string | null;
  country: string | null;
  countryCodeV2: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  province: string | null;
  provinceCode: string | null;
  zip: string | null;
}

export interface ShopifyOrder {
  id: string;
  orderNumber: number;
  processedAt: string;
  fulfillmentStatus: string;
  financialStatus: string;
  totalPrice: ShopifyPrice;
  lineItems: {
    edges: Array<{
      node: {
        title: string;
        quantity: number;
        variant: ShopifyProductVariant | null;
      };
    }>;
  };
}

// Normalized types for app use
export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  price: number;
  compareAtPrice: number | null;
  currencyCode: string;
  image: string | null;
  images: string[];
  tags: string[];
  productType: string;
  availableForSale: boolean;
  variants: ProductVariant[];
  sizes: string[];
  colors: string[];
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: number;
  compareAtPrice: number | null;
  size: string | null;
  color: string | null;
  image: string | null;
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: string | null;
  products: Product[];
}

export interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  handle: string;
  title: string;
  variantTitle: string;
  price: number;
  quantity: number;
  image: string | null;
  size: string | null;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: number;
  total: number;
  items: CartItem[];
}

export interface Customer {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
  phone: string | null;
}

