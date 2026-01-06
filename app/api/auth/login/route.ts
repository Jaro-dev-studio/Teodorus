import { NextRequest, NextResponse } from "next/server";
import { customerLogin } from "@/lib/shopify";

export async function POST(request: NextRequest) {
  console.log("[API] POST /api/auth/login");
  
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    console.log("[API] Attempting login for:", email);

    const result = await customerLogin(email, password);

    if ("error" in result) {
      console.log("[API] Login failed:", result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    console.log("[API] Login successful");

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] Error during login:", error);
    return NextResponse.json(
      { error: "Failed to login" },
      { status: 500 }
    );
  }
}


