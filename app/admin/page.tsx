"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/shopify/types";
import {
  getProducts,
  getMergedProducts,
  createMergedProduct,
  deleteMergedProduct,
} from "./actions";

const ADMIN_PASSWORD = "staz";
const ADMIN_AUTH_KEY = "teodorus_admin_auth";

interface MergedProductRecord {
  id: string;
  primaryHandle: string;
  secondaryHandle: string;
  createdAt: Date;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const [products, setProducts] = React.useState<Product[]>([]);
  const [mergedProducts, setMergedProducts] = React.useState<MergedProductRecord[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [primaryHandle, setPrimaryHandle] = React.useState("");
  const [secondaryHandle, setSecondaryHandle] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveMessage, setSaveMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  // Check localStorage for existing auth on mount
  React.useEffect(() => {
    const storedAuth = localStorage.getItem(ADMIN_AUTH_KEY);
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_AUTH_KEY, "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid password");
    }
  };

  // Fetch products and merged products
  React.useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log("[Admin] Fetching products and merged products...");
        const [productsData, mergedData] = await Promise.all([
          getProducts(),
          getMergedProducts(),
        ]);
        setProducts(productsData);
        setMergedProducts(mergedData);
        console.log("[Admin] Loaded", productsData.length, "products and", mergedData.length, "merged configurations");
      } catch (err) {
        console.error("[Admin] Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const handleCreateMerge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!primaryHandle || !secondaryHandle) {
      setSaveMessage({ type: "error", text: "Please select both products" });
      return;
    }
    if (primaryHandle === secondaryHandle) {
      setSaveMessage({ type: "error", text: "Cannot merge a product with itself" });
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      console.log("[Admin] Creating merge:", primaryHandle, "->", secondaryHandle);
      const result = await createMergedProduct(primaryHandle, secondaryHandle);
      
      if ("error" in result) {
        setSaveMessage({ type: "error", text: result.error });
      } else {
        setSaveMessage({ type: "success", text: "Products merged successfully" });
        setMergedProducts((prev) => [...prev, result]);
        setPrimaryHandle("");
        setSecondaryHandle("");
      }
    } catch (err) {
      console.error("[Admin] Error creating merge:", err);
      setSaveMessage({ type: "error", text: "Failed to merge products" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMerge = async (id: string) => {
    try {
      console.log("[Admin] Deleting merge:", id);
      await deleteMergedProduct(id);
      setMergedProducts((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("[Admin] Error deleting merge:", err);
    }
  };

  // Get product title by handle
  const getProductTitle = (handle: string) => {
    return products.find((p) => p.handle === handle)?.title || handle;
  };

  // Get available products for secondary selection (exclude already merged secondary products)
  const secondaryHandles = new Set(mergedProducts.map((m) => m.secondaryHandle));
  const availableForSecondary = products.filter(
    (p) => p.handle !== primaryHandle && !secondaryHandles.has(p.handle)
  );

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    setIsAuthenticated(false);
    setPassword("");
  };

  // Show nothing while checking auth to prevent flash
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-display font-bold text-foreground">Admin Access</h1>
              <p className="text-sm text-muted-foreground mt-2">Enter password to continue</p>
            </div>

            <div className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full h-12 px-4 bg-secondary text-foreground rounded-lg border-0 focus:ring-2 focus:ring-primary"
                autoFocus
              />

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-red-500"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                className="w-full h-12 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary-hover transition-colors"
              >
                Enter
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Admin Panel</h1>
              <p className="text-muted-foreground mt-2">Manage product merging configurations</p>
            </div>
            <button
              onClick={handleLogout}
              className="h-10 px-4 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Create Merge Form */}
          <div className="bg-secondary/50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Merge Products</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Select a primary product and a secondary product. The secondary product will be hidden 
              from listings and its variants will appear on the primary product page.
            </p>

            <form onSubmit={handleCreateMerge} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Primary Product
                  </label>
                  <select
                    value={primaryHandle}
                    onChange={(e) => setPrimaryHandle(e.target.value)}
                    className="w-full h-12 px-4 bg-background text-foreground rounded-lg border border-border focus:ring-2 focus:ring-primary cursor-pointer"
                    disabled={isLoading}
                  >
                    <option value="">Select primary product...</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.handle}>
                        {product.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Secondary Product (will be hidden)
                  </label>
                  <select
                    value={secondaryHandle}
                    onChange={(e) => setSecondaryHandle(e.target.value)}
                    className="w-full h-12 px-4 bg-background text-foreground rounded-lg border border-border focus:ring-2 focus:ring-primary cursor-pointer"
                    disabled={isLoading || !primaryHandle}
                  >
                    <option value="">Select secondary product...</option>
                    {availableForSecondary.map((product) => (
                      <option key={product.id} value={product.handle}>
                        {product.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <AnimatePresence>
                {saveMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={cn(
                      "text-sm p-3 rounded-lg",
                      saveMessage.type === "success"
                        ? "bg-green-500/10 text-green-600"
                        : "bg-red-500/10 text-red-500"
                    )}
                  >
                    {saveMessage.text}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isSaving || !primaryHandle || !secondaryHandle}
                className={cn(
                  "h-12 px-6 font-medium rounded-lg transition-colors",
                  primaryHandle && secondaryHandle
                    ? "bg-primary text-primary-foreground hover:bg-primary-hover"
                    : "bg-secondary text-muted-foreground cursor-not-allowed"
                )}
              >
                {isSaving ? "Merging..." : "Merge Products"}
              </button>
            </form>
          </div>

          {/* Existing Merges */}
          <div className="bg-secondary/50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Existing Merges</h2>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-secondary rounded-lg animate-pulse" />
                ))}
              </div>
            ) : mergedProducts.length === 0 ? (
              <p className="text-muted-foreground text-sm">No merged products yet.</p>
            ) : (
              <div className="space-y-3">
                {mergedProducts.map((merge) => (
                  <motion.div
                    key={merge.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground truncate">
                          {getProductTitle(merge.primaryHandle)}
                        </span>
                        <span className="text-muted-foreground">+</span>
                        <span className="text-muted-foreground truncate">
                          {getProductTitle(merge.secondaryHandle)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {merge.secondaryHandle} variants shown on {merge.primaryHandle}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteMerge(merge.id)}
                      className="ml-4 h-9 px-3 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                    >
                      Remove
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

