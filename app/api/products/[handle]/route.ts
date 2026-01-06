import { NextRequest, NextResponse } from "next/server";
import { getProductByHandle } from "@/lib/shopify";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;
  
  console.log("[API] GET /api/products/" + handle);
  
  try {
    const product = await getProductByHandle(handle);

    if (!product) {
      console.log("[API] Product not found:", handle);
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    console.log("[API] Returning product:", product.title);

    return NextResponse.json(product);
  } catch (error) {
    console.error("[API] Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

