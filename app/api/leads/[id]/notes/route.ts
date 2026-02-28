import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/leads/[id]/notes
 * Fetch all notes for a specific lead (reverse chronological order)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    // Fetch notes in reverse chronological order (newest first)
    const notes = await prisma.note.findMany({
      where: { leadId: id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        author: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: notes,
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch notes",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/leads/[id]/notes
 * Create a new note for a specific lead
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { content, author = "You" } = body;

    // Validate content
    if (
      !content ||
      typeof content !== "string" ||
      content.trim().length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Note content is required",
        },
        { status: 400 },
      );
    }

    // Verify lead exists
    const lead = await prisma.lead.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!lead) {
      return NextResponse.json(
        {
          success: false,
          error: "Lead not found",
        },
        { status: 404 },
      );
    }

    // Create note and activity in a transaction
    const [note, activity] = await prisma.$transaction([
      prisma.note.create({
        data: {
          leadId: id,
          content: content.trim(),
          author,
        },
      }),
      prisma.activity.create({
        data: {
          leadId: id,
          type: "NOTE_ADDED",
          performedBy: author,
          metadata: {
            noteContent: content.trim().substring(0, 100), // Store preview
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: note,
    });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create note",
      },
      { status: 500 },
    );
  }
}
