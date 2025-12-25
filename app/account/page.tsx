"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/context/auth-context";
import { cn } from "@/lib/utils";

type TabType = "login" | "register" | "forgot";

export default function AccountPage() {
  const { customer, isAuthenticated, isLoading, login, register, logout, recoverPassword } = useAuth();
  
  const [activeTab, setActiveTab] = React.useState<TabType>("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error || "Failed to sign in");
    }
    
    setIsSubmitting(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await register({ email, password, firstName, lastName });
    
    if (!result.success) {
      setError(result.error || "Failed to create account");
    }
    
    setIsSubmitting(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const result = await recoverPassword(email);
    
    if (result.success) {
      setSuccess("Password reset email sent. Check your inbox.");
    } else {
      setError(result.error || "Failed to send reset email");
    }
    
    setIsSubmitting(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <div className="pt-20 sm:pt-24 flex items-center justify-center min-h-[60vh]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="pt-20 sm:pt-24 pb-20">
      <div className="max-w-md mx-auto px-5 sm:px-6">
        {isAuthenticated && customer ? (
          // Logged in view
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
                My Account
              </h1>
              <p className="text-muted-foreground">
                Welcome back, {customer.firstName || customer.displayName}
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Account Details
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="text-foreground">{customer.email}</span>
                  </div>
                  {customer.firstName && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name</span>
                      <span className="text-foreground">
                        {customer.firstName} {customer.lastName}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-border pt-6 space-y-3">
                <Link
                  href="/wishlist"
                  className="flex items-center justify-between p-4 bg-secondary rounded-xl hover:bg-secondary-hover transition-colors"
                >
                  <span className="font-medium">My Wishlist</span>
                  <svg
                    className="w-5 h-5 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center justify-between p-4 bg-secondary rounded-xl hover:bg-secondary-hover transition-colors"
                >
                  <span className="font-medium">Order History</span>
                  <svg
                    className="w-5 h-5 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>

              <button
                onClick={handleLogout}
                className="w-full h-12 border border-border rounded-full text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        ) : (
          // Login/Register view
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
                {activeTab === "login" && "Sign In"}
                {activeTab === "register" && "Create Account"}
                {activeTab === "forgot" && "Reset Password"}
              </h1>
              <p className="text-muted-foreground">
                {activeTab === "login" && "Welcome back to TriggerTs"}
                {activeTab === "register" && "Join the statement makers"}
                {activeTab === "forgot" && "We'll send you a reset link"}
              </p>
            </div>

            {/* Tab switcher */}
            {activeTab !== "forgot" && (
              <div className="flex bg-secondary rounded-full p-1">
                <button
                  onClick={() => {
                    setActiveTab("login");
                    setError("");
                  }}
                  className={cn(
                    "flex-1 h-10 rounded-full font-medium transition-colors",
                    activeTab === "login"
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setActiveTab("register");
                    setError("");
                  }}
                  className={cn(
                    "flex-1 h-10 rounded-full font-medium transition-colors",
                    activeTab === "register"
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Register
                </button>
              </div>
            )}

            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl text-accent text-sm">
                {success}
              </div>
            )}

            {/* Login Form */}
            {activeTab === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-12 px-4 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-12 px-4 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your password"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("forgot");
                    setError("");
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot password?
                </button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-14 bg-foreground text-background font-medium rounded-full hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </motion.button>
              </form>
            )}

            {/* Register Form */}
            {activeTab === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full h-12 px-4 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full h-12 px-4 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="reg-email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-12 px-4 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="reg-password" className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <input
                    id="reg-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full h-12 px-4 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Min 8 characters"
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-14 bg-foreground text-background font-medium rounded-full hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </motion.button>
              </form>
            )}

            {/* Forgot Password Form */}
            {activeTab === "forgot" && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-12 px-4 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="you@example.com"
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-14 bg-foreground text-background font-medium rounded-full hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </motion.button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("login");
                    setError("");
                    setSuccess("");
                  }}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Back to sign in
                </button>
              </form>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
