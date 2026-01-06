"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/context/auth-context";
import type { Order } from "@/lib/shopify/types";
import { Button } from "@/components/ui/button";
import { RevealText } from "@/components/storefront/animated-text";
import { cn } from "@/lib/utils";

const AUTH_TOKEN_KEY = "shopify_customer_token";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatPrice(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}

function getStatusColor(status: string): string {
  const statusLower = status.toLowerCase();
  if (statusLower === "fulfilled" || statusLower === "paid") {
    return "bg-green-100 text-green-800";
  }
  if (statusLower === "unfulfilled" || statusLower === "pending") {
    return "bg-amber-100 text-amber-800";
  }
  if (statusLower === "cancelled" || statusLower === "refunded") {
    return "bg-red-100 text-red-800";
  }
  return "bg-secondary text-muted-foreground";
}

function formatStatus(status: string): string {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function OrdersPage() {
  const { isAuthenticated, isLoading: authLoading, customer } = useAuth();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [expandedOrder, setExpandedOrder] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          const res = await fetch("/api/orders", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!res.ok) {
            throw new Error("Failed to fetch orders");
          }
          const ordersData: Order[] = await res.json();
          setOrders(ordersData);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchOrders();
    }
  }, [isAuthenticated, authLoading]);

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className="pt-12 sm:pt-14 md:pt-16">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-secondary rounded w-48" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-secondary rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="pt-12 sm:pt-14 md:pt-16">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-secondary flex items-center justify-center">
              <svg
                className="w-10 h-10 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.25}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4">
              Sign in to view orders
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Please sign in to your account to view your order history.
            </p>
            <Button asChild className="rounded-full h-12 px-8">
              <Link href="/account">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-12 sm:pt-14 md:pt-16">
      {/* Header */}
      <section className="py-8 sm:py-12 md:py-16 border-b border-border">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          <RevealText>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground">
              Order History
            </h1>
          </RevealText>
          {customer && (
            <p className="mt-4 text-muted-foreground">
              {customer.email}
            </p>
          )}
        </div>
      </section>

      {/* Orders */}
      <section className="py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-secondary flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.25}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-display text-foreground mb-3">
                No orders yet
              </h2>
              <p className="text-muted-foreground mb-8">
                Start shopping to see your orders here.
              </p>
              <Button asChild className="rounded-full h-12 px-8">
                <Link href="/shop">Shop Now</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-border rounded-lg overflow-hidden bg-card"
                >
                  {/* Order header */}
                  <button
                    onClick={() =>
                      setExpandedOrder(
                        expandedOrder === order.id ? null : order.id
                      )
                    }
                    className="w-full p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-foreground">
                          {order.name}
                        </span>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full font-medium",
                            getStatusColor(order.fulfillmentStatus)
                          )}
                        >
                          {formatStatus(order.fulfillmentStatus)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.processedAt)} &middot;{" "}
                        {order.lineItems.length} item
                        {order.lineItems.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-display text-foreground">
                        {formatPrice(order.totalPrice, order.currencyCode)}
                      </span>
                      <svg
                        className={cn(
                          "w-5 h-5 text-muted-foreground transition-transform",
                          expandedOrder === order.id && "rotate-180"
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Expanded order details */}
                  {expandedOrder === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-border"
                    >
                      {/* Line items */}
                      <div className="p-4 sm:p-6 space-y-4">
                        {order.lineItems.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex gap-4"
                          >
                            {/* Product image */}
                            <div className="w-16 h-20 bg-secondary rounded flex-shrink-0 overflow-hidden">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-foreground/5 font-display text-sm">
                                  TT
                                </div>
                              )}
                            </div>

                            {/* Item details */}
                            <div className="flex-1 min-w-0">
                              {item.productHandle ? (
                                <Link
                                  href={`/product/${item.productHandle}`}
                                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                                >
                                  {item.title}
                                </Link>
                              ) : (
                                <p className="text-sm font-medium text-foreground">
                                  {item.title}
                                </p>
                              )}
                              {item.options.length > 0 && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {item.options
                                    .map((o) => `${o.name}: ${o.value}`)
                                    .join(" / ")}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground mt-1">
                                Qty: {item.quantity}
                              </p>
                            </div>

                            {/* Price */}
                            <p className="text-sm text-foreground">
                              {formatPrice(item.price, item.currencyCode)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Order summary */}
                      <div className="border-t border-border p-4 sm:p-6 bg-secondary/30">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="text-foreground">
                              {formatPrice(order.subtotalPrice, order.currencyCode)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Shipping</span>
                            <span className="text-foreground">
                              {order.shippingPrice > 0
                                ? formatPrice(order.shippingPrice, order.currencyCode)
                                : "Free"}
                            </span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-border font-medium">
                            <span className="text-foreground">Total</span>
                            <span className="text-foreground">
                              {formatPrice(order.totalPrice, order.currencyCode)}
                            </span>
                          </div>
                        </div>

                        {/* Shipping address */}
                        {order.shippingAddress && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                              Shipping Address
                            </p>
                            <p className="text-sm text-foreground">
                              {order.shippingAddress.address1}
                              {order.shippingAddress.city && (
                                <>
                                  <br />
                                  {order.shippingAddress.city}
                                  {order.shippingAddress.province &&
                                    `, ${order.shippingAddress.province}`}
                                  {order.shippingAddress.zip &&
                                    ` ${order.shippingAddress.zip}`}
                                </>
                              )}
                              {order.shippingAddress.country && (
                                <>
                                  <br />
                                  {order.shippingAddress.country}
                                </>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

