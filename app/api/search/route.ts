import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/shopify";

export async function GET(request: NextRequest) {
  console.log("[API] GET /api/search");
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const first = parseInt(searchParams.get("first") || "20", 10);

    console.log("[API] Searching products with query:", query, "first:", first);

    if (!query.trim()) {
      return NextResponse.json([]);
    }

    const products = await searchProducts(query, first);

    console.log("[API] Found", products.length, "products matching query");

    return NextResponse.json(products);
  } catch (error) {
    console.error("[API] Error searching products:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }
}

