import { NextRequest, NextResponse } from "next/server";
import { customerRegister } from "@/lib/shopify";

export async function POST(request: NextRequest) {
  console.log("[API] POST /api/auth/register");
  
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    console.log("[API] Attempting registration for:", email);

    const result = await customerRegister({ email, password, firstName, lastName });

    if ("error" in result) {
      console.log("[API] Registration failed:", result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    console.log("[API] Registration successful");

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] Error during registration:", error);
    return NextResponse.json(
      { error: "Failed to register" },
      { status: 500 }
    );
  }
}



