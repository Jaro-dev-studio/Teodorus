import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/shopify";

export async function GET(request: NextRequest) {
  console.log("[API] GET /api/products");
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const first = parseInt(searchParams.get("first") || "50", 10);
    const sortKey = (searchParams.get("sortKey") as "BEST_SELLING" | "PRICE" | "CREATED_AT" | "TITLE") || "BEST_SELLING";
    const reverse = searchParams.get("reverse") === "true";
    const includeHidden = searchParams.get("includeHidden") === "true";

    console.log("[API] Fetching products with options:", { first, sortKey, reverse, includeHidden });

    const products = await getProducts({ first, sortKey, reverse, includeHidden });

    console.log("[API] Returning", products.length, "products");

    return NextResponse.json(products);
  } catch (error) {
    console.error("[API] Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

