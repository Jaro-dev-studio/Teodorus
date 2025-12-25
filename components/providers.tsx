"use client";

import { AuthProvider } from "@/lib/context/auth-context";
import { WishlistProvider } from "@/lib/context/wishlist-context";
import { StorefrontLayout } from "@/components/storefront/storefront-layout";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WishlistProvider>
        <StorefrontLayout>{children}</StorefrontLayout>
      </WishlistProvider>
    </AuthProvider>
  );
}
