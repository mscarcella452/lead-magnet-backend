import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { sendInviteEmail } from "@/lib/email";

const prisma = new PrismaClient();

// POST /api/admin/users/[userId]/resend-invite - Resend invite email
export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { userId } = params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Only resend if user doesn't have password set
    if (user.password) {
      return NextResponse.json(
        { error: "User already has password set" },
        { status: 400 }
      );
    }

    // Delete old invite if exists
    await prisma.userInvite.deleteMany({
      where: { userId },
    });

    // Generate new invite token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.userInvite.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });

    // Send invite email
    await sendInviteEmail(user.email, user.name, token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error resending invite:", error);
    return NextResponse.json(
      { error: "Failed to resend invite" },
      { status: 500 }
    );
  }
}
