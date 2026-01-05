"use server";

import prisma from "@/lib/prisma";

export async function getMergedProducts() {
  console.log("[Admin] Fetching merged products from database...");
  
  const mergedProducts = await prisma.mergedProduct.findMany({
    orderBy: { createdAt: "desc" },
  });
  
  console.log("[Admin] Found", mergedProducts.length, "merged product configurations");
  
  return mergedProducts;
}

export async function createMergedProduct(primaryHandle: string, secondaryHandle: string) {
  console.log("[Admin] Creating merged product:", primaryHandle, "->", secondaryHandle);
  
  // Check if this merge already exists
  const existing = await prisma.mergedProduct.findFirst({
    where: {
      OR: [
        { primaryHandle, secondaryHandle },
        { primaryHandle: secondaryHandle, secondaryHandle: primaryHandle },
      ],
    },
  });
  
  if (existing) {
    console.log("[Admin] Merge already exists");
    return { error: "These products are already merged" };
  }
  
  // Check if secondary is already used as a secondary in another merge
  const secondaryUsed = await prisma.mergedProduct.findFirst({
    where: { secondaryHandle },
  });
  
  if (secondaryUsed) {
    console.log("[Admin] Secondary product already used in another merge");
    return { error: "This product is already used as a secondary in another merge" };
  }
  
  const mergedProduct = await prisma.mergedProduct.create({
    data: {
      primaryHandle,
      secondaryHandle,
    },
  });
  
  console.log("[Admin] Created merged product with ID:", mergedProduct.id);
  
  return mergedProduct;
}

export async function deleteMergedProduct(id: string) {
  console.log("[Admin] Deleting merged product:", id);
  
  await prisma.mergedProduct.delete({
    where: { id },
  });
  
  console.log("[Admin] Deleted merged product");
  
  return { success: true };
}

// Get all secondary handles that should be hidden from listings
export async function getHiddenProductHandles(): Promise<string[]> {
  const mergedProducts = await prisma.mergedProduct.findMany({
    select: { secondaryHandle: true },
  });
  
  return mergedProducts.map((m) => m.secondaryHandle);
}

// Get merged products for a primary product handle
export async function getMergedProductsForPrimary(primaryHandle: string) {
  const mergedProducts = await prisma.mergedProduct.findMany({
    where: { primaryHandle },
    select: { secondaryHandle: true },
  });
  
  return mergedProducts.map((m) => m.secondaryHandle);
}

// Check if a product handle is a secondary (hidden) product
export async function isSecondaryProduct(handle: string): Promise<string | null> {
  const merged = await prisma.mergedProduct.findFirst({
    where: { secondaryHandle: handle },
    select: { primaryHandle: true },
  });
  
  return merged?.primaryHandle ?? null;
}

