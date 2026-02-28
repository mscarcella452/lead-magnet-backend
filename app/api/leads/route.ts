import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { leadSubmissionSchema } from "@/lib/utils/validation";
import {
  validateOrigin,
  validateApiKey,
  getCorsHeaders,
  SecurityError,
} from "@/lib/security";
import { sendLeadMagnetEmail } from "@/lib/email";
import { ApiResponse } from "@/types";

// Helper to generate unique display ID
function generateDisplayId(): string {
  return `LD-${String(Math.floor(Math.random() * 100000)).padStart(5, "0")}`;
}

/**
 * POST /api/leads
 *
 * Public endpoint for external client websites to submit leads.
 *
 * Security:
 * - CORS validation (checks origin against allowed list)
 * - Optional API key validation (via x-api-key header)
 *
 * Request body:
 * {
 *   email: string (required)
 *   name: string (required)
 *   source?: string (optional - e.g., "website-a")
 *   metadata?: object (optional - custom fields)
 * }
 *
 * Response:
 * {
 *   success: boolean
 *   data?: { id: string, email: string }
 *   error?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Security validation
    validateOrigin(request);
    validateApiKey(request);

    // Parse and validate request body
    const body = await request.json();
    const validatedData = leadSubmissionSchema.parse(body);

    // Check if lead already exists (upsert behavior)
    const existingLead = await prisma.lead.findUnique({
      where: { email: validatedData.email },
    });

    let lead;
    if (existingLead) {
      // Update existing lead
      lead = await prisma.lead.update({
        where: { email: validatedData.email },
        data: {
          name: validatedData.name,
          source: validatedData.source,
          metadata: validatedData.metadata,
        },
      });
      console.log("✅ Updated existing lead:", lead.email);
    } else {
      // Create new lead
      lead = await prisma.lead.create({
        data: {
          email: validatedData.email,
          name: validatedData.name,
          source: validatedData.source,
          metadata: validatedData.metadata,
          displayId: generateDisplayId(),
        },
      });
      console.log("✅ Created new lead:", lead.email);
    }

    // Send lead magnet email (placeholder for now)
    const pdfUrl =
      process.env.LEAD_MAGNET_PDF_URL || "https://example.com/lead-magnet.pdf";
    await sendLeadMagnetEmail(lead.email, pdfUrl);

    // Return success response with CORS headers
    const response: ApiResponse = {
      success: true,
      data: {
        id: lead.id,
        email: lead.email,
      },
      message: existingLead
        ? "Lead updated successfully"
        : "Lead created successfully",
    };

    return NextResponse.json(response, {
      status: existingLead ? 200 : 201,
      headers: getCorsHeaders(request),
    });
  } catch (error) {
    console.error("Error in POST /api/leads:", error);

    // Handle security errors
    if (error instanceof SecurityError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        {
          status: error.statusCode,
          headers: getCorsHeaders(request),
        },
      );
    }

    // Handle validation errors
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.message,
        },
        {
          status: 400,
          headers: getCorsHeaders(request),
        },
      );
    }

    // Handle database errors
    if (error instanceof Error && error.message.includes("Prisma")) {
      return NextResponse.json(
        {
          success: false,
          error: "Database error",
        },
        {
          status: 500,
          headers: getCorsHeaders(request),
        },
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      {
        status: 500,
        headers: getCorsHeaders(request),
      },
    );
  }
}

/**
 * OPTIONS /api/leads
 *
 * Handle CORS preflight requests
 */
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: getCorsHeaders(request),
    },
  );
}
