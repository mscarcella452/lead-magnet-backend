import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import { leadSubmissionSchema } from "@/lib/utils/validation";
import {
  validateOrigin,
  validateApiKey,
  getCorsHeaders,
  SecurityError,
} from "@/lib/server/security";
import { sendLeadMagnetEmail } from "@/lib/server/email/send/sendLeadMagnetEmail";
import { ApiResponse } from "@/types";

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
 *   source?: string (optional)
 *   metadata?: object (optional)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    validateOrigin(request);
    validateApiKey(request);

    const body = await request.json();
    const validatedData = leadSubmissionSchema.parse(body);

    const lead = await prisma.lead.upsert({
      where: { email: validatedData.email },
      update: {
        name: validatedData.name,
        source: validatedData.source,
        metadata: validatedData.metadata,
      },
      create: {
        email: validatedData.email,
        name: validatedData.name,
        source: validatedData.source,
        metadata: validatedData.metadata,
        displayId: `LD-${nanoid(8)}`,
      },
    });

    // Derive isNew from timestamps — no extra DB query needed
    const isNew = lead.createdAt.getTime() === lead.updatedAt.getTime();

    console.log(
      isNew ? "Created new lead:" : "Updated existing lead:",
      lead.email,
    );

    // Email is non-blocking — lead is already saved, don't fail the request
    const pdfUrl =
      process.env.LEAD_MAGNET_PDF_URL || "https://example.com/lead-magnet.pdf";
    try {
      await sendLeadMagnetEmail(lead.email, pdfUrl);
    } catch (emailError) {
      console.error("Email failed for lead:", lead.email, emailError);
    }

    const response: ApiResponse = {
      success: true,
      data: { id: lead.id, email: lead.email },
      message: isNew
        ? "Lead created successfully"
        : "Lead updated successfully",
    };

    return NextResponse.json(response, {
      status: isNew ? 201 : 200,
      headers: getCorsHeaders(request),
    });
  } catch (error) {
    console.error("Error in POST /api/leads:", error);

    if (error instanceof SecurityError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode, headers: getCorsHeaders(request) },
      );
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.errors },
        { status: 400, headers: getCorsHeaders(request) },
      );
    }

    if (error instanceof Error && error.message.includes("Prisma")) {
      return NextResponse.json(
        { success: false, error: "Database error" },
        { status: 500, headers: getCorsHeaders(request) },
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500, headers: getCorsHeaders(request) },
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    { status: 200, headers: getCorsHeaders(request) },
  );
}
