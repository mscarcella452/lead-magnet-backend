import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface UserSeedData {
  name: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

async function seedUsers() {
  console.log("Starting user seed...");

  // Define users to seed from environment variables
  const usersToSeed: UserSeedData[] = [];

  // Admin user
  if (
    process.env.ADMIN_NAME &&
    process.env.ADMIN_USERNAME &&
    process.env.ADMIN_EMAIL &&
    process.env.ADMIN_PASSWORD
  ) {
    usersToSeed.push({
      name: process.env.ADMIN_NAME,
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "ADMIN" as UserRole,
    });
  } else {
    console.warn("⚠️  Admin user environment variables not fully set");
  }

  // Dev user
  if (
    process.env.DEV_NAME &&
    process.env.DEV_USERNAME &&
    process.env.DEV_EMAIL &&
    process.env.DEV_PASSWORD
  ) {
    usersToSeed.push({
      name: process.env.DEV_NAME,
      username: process.env.DEV_USERNAME,
      email: process.env.DEV_EMAIL,
      password: process.env.DEV_PASSWORD,
      role: "DEV" as UserRole,
    });
  } else {
    console.warn("⚠️  Dev user environment variables not fully set");
  }

  if (usersToSeed.length === 0) {
    console.error(
      "❌ No users to seed. Please set environment variables for ADMIN and DEV users."
    );
    process.exit(1);
  }

  // Seed each user
  for (const userData of usersToSeed) {
    const existingUser = await prisma.user.findUnique({
      where: { username: userData.username },
    });

    if (existingUser) {
      console.log(`✓ User "${userData.username}" already exists, skipping...`);
      continue;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        name: userData.name,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
      },
    });

    console.log(
      `✓ Created ${userData.role.toLowerCase()} user: ${user.username} (${user.email})`
    );
  }

  console.log("✓ User seed completed!");
}

seedUsers()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
