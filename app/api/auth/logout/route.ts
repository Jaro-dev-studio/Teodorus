import { NextRequest, NextResponse } from "next/server";
import { customerLogout } from "@/lib/shopify";

export async function POST(request: NextRequest) {
  console.log("[API] POST /api/auth/logout");
  
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (token) {
      console.log("[API] Logging out customer...");
      await customerLogout(token);
    }

    console.log("[API] Logout successful");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Error during logout:", error);
    // Still return success - we want to clear local state even if server logout fails
    return NextResponse.json({ success: true });
  }
}

