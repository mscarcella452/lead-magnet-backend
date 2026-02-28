import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword, setAuthCookie } from "@/lib/auth";
import { adminLoginSchema } from "@/lib/utils/validation";

/**
 * POST /api/admin/login
 *
 * Admin login endpoint.
 * Validates password and sets authentication cookie.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = adminLoginSchema.parse(body);

    // Verify password
    const isValid = verifyAdminPassword(password);

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid password",
        },
        { status: 401 },
      );
    }

    // Set auth cookie
    await setAuthCookie();

    return NextResponse.json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("❌ Login error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Login failed",
      },
      { status: 500 },
    );
  }
}
