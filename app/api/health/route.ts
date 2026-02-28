import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/health
 *
 * Health check endpoint for monitoring.
 * Verifies API is running and database is accessible.
 *
 * Response:
 * {
 *   status: "ok" | "error"
 *   timestamp: string
 *   database: "connected" | "disconnected"
 * }
 */
export async function GET() {
  try {
    // Check database connection by attempting a simple query
    await prisma.lead.findFirst();

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "connected",
      version: "1.0.0",
    });
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    );
  }
}
