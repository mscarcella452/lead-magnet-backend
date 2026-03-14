import "server-only";
import { auth } from "@/auth";

export interface CurrentUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
}

/**
 * Get the current authenticated user from the session
 * Use this in server components and server actions to get user context
 * for activity logging and authorization checks
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id as string,
    name: session.user.name || "",
    username: session.user.username as string,
    email: session.user.email || "",
    role: session.user.role as string,
  };
}
