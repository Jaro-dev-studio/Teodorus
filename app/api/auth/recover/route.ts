import { NextRequest, NextResponse } from "next/server";
import { customerRecover } from "@/lib/shopify";

export async function POST(request: NextRequest) {
  console.log("[API] POST /api/auth/recover");
  
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    console.log("[API] Sending password recovery email to:", email);

    const result = await customerRecover(email);

    if (!result.success) {
      console.log("[API] Password recovery failed:", result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    console.log("[API] Password recovery email sent");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Error during password recovery:", error);
    return NextResponse.json(
      { error: "Failed to send recovery email" },
      { status: 500 }
    );
  }
}


