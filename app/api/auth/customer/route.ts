import { NextRequest, NextResponse } from "next/server";
import { getCustomer } from "@/lib/shopify";

export async function GET(request: NextRequest) {
  console.log("[API] GET /api/auth/customer");
  
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[API] Fetching customer data...");

    const customer = await getCustomer(token);

    if (!customer) {
      console.log("[API] Customer not found or token invalid");
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    console.log("[API] Returning customer:", customer.email);

    return NextResponse.json(customer);
  } catch (error) {
    console.error("[API] Error fetching customer:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer" },
      { status: 500 }
    );
  }
}

