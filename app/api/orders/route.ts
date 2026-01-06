import { NextRequest, NextResponse } from "next/server";
import { getCustomerOrders } from "@/lib/shopify";

export async function GET(request: NextRequest) {
  console.log("[API] GET /api/orders");
  
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[API] Fetching orders for customer...");

    const orders = await getCustomerOrders(token);

    console.log("[API] Returning", orders.length, "orders");

    return NextResponse.json(orders);
  } catch (error) {
    console.error("[API] Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

