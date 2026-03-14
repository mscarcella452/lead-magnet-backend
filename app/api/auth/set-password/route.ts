import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Missing token or password" },
        { status: 400 }
      );
    }

    // Find the invite with this token
    const invite = await prisma.userInvite.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!invite) {
      return NextResponse.json(
        { error: "Invalid invite link" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (new Date() > invite.expiresAt) {
      return NextResponse.json(
        { error: "Your invite link has expired. Please ask your admin to resend your invite." },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user with password
    const updatedUser = await prisma.user.update({
      where: { id: invite.userId },
      data: { password: hashedPassword },
    });

    // Delete the invite (single-use token)
    await prisma.userInvite.delete({
      where: { id: invite.id },
    });

    return NextResponse.json({
      success: true,
      username: updatedUser.username,
      message: "Password set successfully",
    });
  } catch (error) {
    console.error("Error setting password:", error);
    return NextResponse.json(
      { error: "Failed to set password" },
      { status: 500 }
    );
  }
}
