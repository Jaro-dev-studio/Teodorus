"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { RevealText } from "@/components/storefront/animated-text";
import { getCollections } from "@/lib/shopify";
import type { Collection } from "@/lib/shopify/types";

export default function CollectionsPage() {
  const [collections, setCollections] = React.useState<Omit<Collection, "products">[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await getCollections();
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return (
    <div className="pt-12 sm:pt-14 md:pt-16">
      {/* Header */}
      <section className="py-8 sm:py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <RevealText>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-3 sm:mb-4">
              Collections
            </h1>
          </RevealText>
          <RevealText delay={0.1}>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl">
              Curated collections for every type of statement maker.
            </p>
          </RevealText>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] rounded-2xl bg-secondary animate-pulse"
                />
              ))}
            </div>
          ) : collections.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {collections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link
                    href={`/collections/${collection.handle}`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-card mb-4">
                      {collection.image ? (
                        <img
                          src={collection.image}
                          alt={collection.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 via-card to-accent/5">
                          <p className="text-5xl sm:text-6xl font-display font-bold text-foreground/5">
                            {collection.title.charAt(0)}
                          </p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                          View Collection
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground group-hover:text-primary transition-colors">
                      {collection.title}
                    </h2>
                    {collection.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {collection.description}
                      </p>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">No collections found.</p>
              <Link
                href="/shop"
                className="text-primary font-medium hover:underline"
              >
                Browse all products
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
