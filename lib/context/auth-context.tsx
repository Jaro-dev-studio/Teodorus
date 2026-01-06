"use client";

import * as React from "react";
import type { Customer } from "@/lib/shopify/types";

const AUTH_TOKEN_KEY = "shopify_customer_token";
const AUTH_TOKEN_EXPIRY_KEY = "shopify_customer_token_expiry";

interface AuthContextType {
  customer: Customer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (input: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  recoverPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  refreshCustomer: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = React.useState<Customer | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Check for existing session on mount
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        const expiry = localStorage.getItem(AUTH_TOKEN_EXPIRY_KEY);

        if (token && expiry) {
          // Check if token is expired
          if (new Date(expiry) > new Date()) {
            const res = await fetch("/api/auth/customer", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (res.ok) {
              const customerData: Customer = await res.json();
              setCustomer(customerData);
            } else {
              // Token invalid, clear storage
              localStorage.removeItem(AUTH_TOKEN_KEY);
              localStorage.removeItem(AUTH_TOKEN_EXPIRY_KEY);
            }
          } else {
            // Token expired, clear storage
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(AUTH_TOKEN_EXPIRY_KEY);
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) {
        const errorData = await loginRes.json();
        return { success: false, error: errorData.error || "Login failed" };
      }

      const result: { accessToken: string; expiresAt: string } = await loginRes.json();

      // Store token
      localStorage.setItem(AUTH_TOKEN_KEY, result.accessToken);
      localStorage.setItem(AUTH_TOKEN_EXPIRY_KEY, result.expiresAt);

      // Fetch customer data
      const customerRes = await fetch("/api/auth/customer", {
        headers: {
          Authorization: `Bearer ${result.accessToken}`,
        },
      });
      if (customerRes.ok) {
        const customerData: Customer = await customerRes.json();
        setCustomer(customerData);
      }

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const register = async (input: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, error: errorData.error || "Registration failed" };
      }

      // Auto-login after registration
      return login(input.email, input.password);
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_TOKEN_EXPIRY_KEY);
      setCustomer(null);
    }
  };

  const recoverPassword = async (
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/recover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, error: errorData.error || "Recovery failed" };
      }

      return { success: true };
    } catch (error) {
      console.error("Password recovery error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const refreshCustomer = async (): Promise<void> => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      try {
        const res = await fetch("/api/auth/customer", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const customerData: Customer = await res.json();
          setCustomer(customerData);
        }
      } catch (error) {
        console.error("Error refreshing customer:", error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        isLoading,
        isAuthenticated: !!customer,
        login,
        register,
        logout,
        recoverPassword,
        refreshCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}


