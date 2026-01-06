import { NextRequest, NextResponse } from "next/server";
import { getCollectionProducts } from "@/lib/shopify";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;
  
  console.log("[API] GET /api/collections/" + handle);
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const first = parseInt(searchParams.get("first") || "50", 10);
    const sortKey = (searchParams.get("sortKey") as "BEST_SELLING" | "PRICE" | "CREATED_AT" | "TITLE" | "COLLECTION_DEFAULT") || "BEST_SELLING";
    const reverse = searchParams.get("reverse") === "true";

    console.log("[API] Fetching collection products with options:", { handle, first, sortKey, reverse });

    const result = await getCollectionProducts(handle, { first, sortKey, reverse });

    console.log("[API] Returning", result.products.length, "products for collection", handle);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] Error fetching collection products:", error);
    return NextResponse.json(
      { error: "Failed to fetch collection products" },
      { status: 500 }
    );
  }
}


