import { NextRequest, NextResponse } from "next/server";
import { getProductsByIds } from "@/lib/shopify";

export async function POST(request: NextRequest) {
  console.log("[API] POST /api/products/by-ids");
  
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: "Invalid request: ids array required" },
        { status: 400 }
      );
    }

    console.log("[API] Fetching products by IDs:", ids.length, "products");

    const products = await getProductsByIds(ids);

    console.log("[API] Returning", products.length, "products");

    return NextResponse.json(products);
  } catch (error) {
    console.error("[API] Error fetching products by IDs:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}



