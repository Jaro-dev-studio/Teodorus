"use client";

import * as React from "react";
import {
  customerLogin,
  customerRegister,
  customerLogout,
  getCustomer,
  customerRecover,
} from "@/lib/shopify";
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
            const customerData = await getCustomer(token);
            if (customerData) {
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
      const result = await customerLogin(email, password);

      if ("error" in result) {
        return { success: false, error: result.error };
      }

      // Store token
      localStorage.setItem(AUTH_TOKEN_KEY, result.accessToken);
      localStorage.setItem(AUTH_TOKEN_EXPIRY_KEY, result.expiresAt);

      // Fetch customer data
      const customerData = await getCustomer(result.accessToken);
      if (customerData) {
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
      const result = await customerRegister(input);

      if ("error" in result) {
        return { success: false, error: result.error };
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
        await customerLogout(token);
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
      const result = await customerRecover(email);
      return result;
    } catch (error) {
      console.error("Password recovery error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const refreshCustomer = async (): Promise<void> => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      const customerData = await getCustomer(token);
      if (customerData) {
        setCustomer(customerData);
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

