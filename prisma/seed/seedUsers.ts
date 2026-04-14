import { PrismaClient, UserRole } from "@prisma/client";
import { DUMMY_USERS } from "./lib/constants";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export type UsernameToIdMap = Record<string, string>;

export async function seedUsers(): Promise<UsernameToIdMap> {
  console.log("Starting user seed...");
  const usernameToId: UsernameToIdMap = {};

  const envUsers = [];

  if (
    process.env.ADMIN_NAME &&
    process.env.ADMIN_USERNAME &&
    process.env.ADMIN_EMAIL &&
    process.env.ADMIN_PASSWORD
  ) {
    envUsers.push({
      name: process.env.ADMIN_NAME,
      username: process.env.ADMIN_USERNAME.toLowerCase().trim(),
      email: process.env.ADMIN_EMAIL.toLowerCase().trim(),
      password: process.env.ADMIN_PASSWORD,
      role: "OWNER" as UserRole,
    });
  } else {
    console.warn("⚠️  Owner user environment variables not fully set");
  }

  if (
    process.env.DEV_NAME &&
    process.env.DEV_USERNAME &&
    process.env.DEV_EMAIL &&
    process.env.DEV_PASSWORD
  ) {
    envUsers.push({
      name: process.env.DEV_NAME,
      username: process.env.DEV_USERNAME.toLowerCase().trim(),
      email: process.env.DEV_EMAIL.toLowerCase().trim(),
      password: process.env.DEV_PASSWORD,
      role: "DEV" as UserRole,
    });
  } else {
    console.warn("⚠️  Dev user environment variables not fully set");
  }

  for (const userData of [...envUsers, ...DUMMY_USERS]) {
    const existing = await prisma.user.findUnique({
      where: { username: userData.username },
    });

    if (existing) {
      console.log(`✓ User "${userData.username}" already exists, skipping...`);
      usernameToId[userData.username] = existing.id;
      continue;
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        username: userData.username,
        email: userData.email.toLowerCase().trim(),
        password: hashedPassword,
        role: userData.role,
      },
    });

    usernameToId[user.username] = user.id;
    console.log(
      `✓ Created ${userData.role.toLowerCase()} user: ${user.username}`,
    );
  }

  console.log("✓ User seed completed!");
  return usernameToId;
}

seedUsers()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
