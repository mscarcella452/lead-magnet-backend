# Authentication Quick Reference

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Sync database
npx prisma db push

# 4. Seed admin/dev users
npm run seed:users

# 5. Start dev server
npm run dev
```

## Login Credentials (After Seeding)

Use these to test after running `npm run seed:users`:

```
Username: admin
Password: (from ADMIN_PASSWORD env var)

Username: dev
Password: (from DEV_PASSWORD env var)
```

## Common Tasks

### Get Current User in Server Component

```typescript
import { auth } from "@/auth";

export default async function MyPage() {
  const session = await auth();
  const user = session?.user;
  // { id, name, username, email, role }
}
```

### Get Current User in Server Action

```typescript
import { getCurrentUser } from "@/lib/auth-helpers";

export async function myAction() {
  const user = await getCurrentUser();
  // { id, name, username, email, role }
}
```

### Log Activity with User Name

```typescript
import { getCurrentUser } from "@/lib/auth-helpers";

export async function createLead(data: LeadData) {
  const user = await getCurrentUser();
  
  const lead = await prisma.lead.create({ data });
  
  await prisma.activity.create({
    data: {
      leadId: lead.id,
      type: "LEAD_CREATED",
      performedBy: user?.name || "System",
    },
  });
}
```

### Check User Role

```typescript
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();
  
  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }
  
  return <div>Admin content</div>;
}
```

### Use Session in Client Component

```typescript
"use client";

import { useSession } from "next-auth/react";

export function UserGreeting() {
  const { data: session } = useSession();
  
  return <div>Hello, {session?.user?.name}!</div>;
}
```

### Logout User

```typescript
"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button onClick={() => signOut({ redirectTo: "/" })}>
      Log out
    </button>
  );
}
```

## API Endpoints

### Authentication

```
POST /api/auth/signin              # Sign in (NextAuth)
POST /api/auth/signout             # Sign out (NextAuth)
POST /api/auth/callback/credentials # Credentials callback (NextAuth)
POST /api/auth/set-password        # Set password with token
```

### User Management (Admin Only)

```
GET  /api/admin/users                           # List all users
POST /api/admin/users                           # Create new user
DELETE /api/admin/users/[userId]                # Delete user
POST /api/admin/users/[userId]/resend-invite    # Resend invite email
```

## Routes

### Public

```
GET  /                    # Login page
GET  /auth/set-password   # Set password (with token param)
GET  /auth/forgot-password # Password reset request
GET  /auth/reset-password  # Password reset with code
```

### Protected

```
GET  /dashboard/*         # All dashboard routes
GET  /dashboard/admin/users  # User management (ADMIN only)
```

## Database Models

### User

```typescript
{
  id: string;           // MongoDB ObjectId
  name: string;         // Full name
  username: string;     // Unique, indexed
  email: string;        // Unique
  password: string | null;  // bcrypt hash, null until set
  role: UserRole;       // ADMIN, MARKETING, SUPPORT, SALES, HR, DEV
  createdAt: DateTime;
  updatedAt: DateTime;
  invite?: UserInvite;  // Relation (optional)
}
```

### UserInvite

```typescript
{
  id: string;           // MongoDB ObjectId
  userId: string;       // Foreign key to User
  user: User;           // Relation
  token: string;        // Unique, 64-char hex
  expiresAt: DateTime;  // 24 hours from creation
  createdAt: DateTime;
}
```

### UserRole Enum

```
ADMIN      # Full access
MARKETING  # Marketing team
SUPPORT    # Support team
SALES      # Sales team
HR         # HR team
DEV        # Development (hidden from admin UI)
```

## Environment Variables

```env
# Required
DATABASE_URL=mongodb+srv://...
NEXTAUTH_SECRET=<32-byte base64>
NEXTAUTH_URL=http://localhost:3000

# Admin user (seeded)
ADMIN_NAME=Admin User
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=SecurePassword123!

# Dev user (seeded)
DEV_NAME=Developer
DEV_USERNAME=dev
DEV_EMAIL=dev@example.com
DEV_PASSWORD=DevPassword123!

# Email
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
APP_URL=http://localhost:3000
```

## Session Object

```typescript
{
  user: {
    id: string;       // User ID
    name: string;     // User's name
    username: string; // Username
    email: string;    // Email
    role: string;     // User role
  }
}
```

## File Locations

```
auth.config.ts                              # Auth config
auth.ts                                     # Auth export
middleware.ts                               # Route protection
lib/auth-helpers.ts                         # getCurrentUser()
lib/email.ts                                # Email functions
app/page.tsx                                # Login page
app/auth/set-password/page.tsx              # Set password
app/dashboard/admin/users/page.tsx          # User management
components/auth/login-form.tsx              # Login form
components/auth/log-out-button.tsx          # Logout button
components/admin/users-management-page.tsx  # User management UI
app/api/auth/[...nextauth]/route.ts         # NextAuth API
app/api/admin/users/route.ts                # User API
prisma/schema.prisma                        # Database schema
prisma/seedUsers.ts                         # User seeding
```

## Debugging

### Check Session in Browser

```typescript
// In browser console
const response = await fetch('/api/auth/session');
const session = await response.json();
console.log(session);
```

### Check Database Users

```bash
npx prisma studio
# Navigate to users table
```

### View Logs

```bash
# Terminal where dev server runs
npm run dev
# Look for auth-related logs
```

## Common Errors

| Error | Solution |
|-------|----------|
| "Invalid username or password" | Check credentials, verify user exists |
| "Your invite link has expired" | Admin resends invite |
| "Cannot delete your own account" | Delete a different user |
| "DEV users cannot be deleted" | DEV users are protected |
| "Email not received" | Check RESEND_API_KEY, EMAIL_FROM, APP_URL |
| "Session not persisting" | Check NEXTAUTH_SECRET, clear cookies |

## Tips

- Always use `getCurrentUser()` instead of hardcoding "You" or "System" in activity logs
- Check user role before rendering admin-only content
- Use `useSession()` in client components, `auth()` in server components
- Invite tokens are single-use and expire after 24 hours
- DEV users are hidden from admin UI but fully functional
- Password hashing is automatic with bcryptjs
- Session includes all user data needed for authorization

## Links

- [NextAuth.js Docs](https://authjs.dev/)
- [Resend Docs](https://resend.com/docs)
- [Prisma Docs](https://www.prisma.io/docs/)
- [MongoDB Docs](https://docs.mongodb.com/)
