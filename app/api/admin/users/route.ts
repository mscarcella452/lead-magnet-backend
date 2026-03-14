import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { sendInviteEmail } from "@/lib/email";

const prisma = new PrismaClient();

// GET /api/admin/users - List all users (except DEV role)
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      where: {
        role: {
          not: "DEV", // Hide DEV users from admin UI
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        password: true,
        createdAt: true,
        invite: {
          select: {
            expiresAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create new user
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { name, username, email, role } = await req.json();

    if (!name || !username || !email || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate role (no DEV)
    if (role === "DEV") {
      return NextResponse.json(
        { error: "Cannot create DEV users from admin UI" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username or email already exists" },
        { status: 400 }
      );
    }

    // Create user without password
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        role,
      },
    });

    // Generate invite token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.userInvite.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // Send invite email
    await sendInviteEmail(email, name, token);

    return NextResponse.json(
      { success: true, user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
