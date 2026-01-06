import { NextResponse } from "next/server";
import { getCollections } from "@/lib/shopify";

export async function GET() {
  console.log("[API] GET /api/collections");
  
  try {
    const collections = await getCollections();

    console.log("[API] Returning", collections.length, "collections");

    return NextResponse.json(collections);
  } catch (error) {
    console.error("[API] Error fetching collections:", error);
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 }
    );
  }
}

