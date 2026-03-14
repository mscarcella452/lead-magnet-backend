# NextAuth.js v5 Setup Guide

This guide covers the complete NextAuth.js v5 setup for the white-label lead dashboard with Credentials provider, magic link invites, and user management.

## Installation

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `next-auth@5.0.0` - Authentication library
- `bcryptjs@2.4.3` - Password hashing
- `resend@3.0.0` - Email service

### 2. Generate Prisma Client

```bash
npx prisma generate
```

This regenerates the Prisma client with the new `User`, `UserInvite`, and `UserRole` types.

### 3. Sync Database Schema

```bash
npx prisma db push
```

This creates the `users` and `user_invites` collections in MongoDB.

## Environment Variables

Set these in your `.env.local` file:

```env
# Database
DATABASE_URL=mongodb+srv://...

# NextAuth
NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000  # or your production URL

# Admin User (seeded on first run)
ADMIN_NAME=Admin User
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=SecurePassword123!

# Dev User (seeded on first run)
DEV_NAME=Developer
DEV_USERNAME=dev
DEV_EMAIL=dev@example.com
DEV_PASSWORD=DevPassword123!

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
APP_URL=http://localhost:3000  # or your production URL
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## Seed Initial Users

After setting environment variables, seed the admin and dev users:

```bash
npm run seed:users
```

This creates:
- **Admin user** - Full access to user management
- **Dev user** - Hidden from admin UI, for development/testing

Both users are created with passwords from environment variables (no invite email sent).

## Architecture

### Authentication Flow

```
1. User visits / (login page)
   ↓
2. Enters username + password
   ↓
3. NextAuth Credentials provider validates against database
   ↓
4. Session created with JWT containing: id, name, username, email, role
   ↓
5. Middleware checks session on protected routes
   ↓
6. Redirect to /dashboard on success
```

### User Invitation Flow

```
1. Admin creates user via /dashboard/admin/users
   ↓
2. User created without password
   ↓
3. UserInvite record created with 24-hour expiring token
   ↓
4. Invite email sent with magic link: /auth/set-password?token=xxx
   ↓
5. User clicks link, validates token, sets password
   ↓
6. Invite deleted (single-use), user logged in automatically
   ↓
7. Redirect to /dashboard
```

## File Structure

### Core Auth Files

```
auth.config.ts              # NextAuth v5 configuration
auth.ts                     # NextAuth initialization
middleware.ts               # Route protection middleware
lib/auth-helpers.ts         # getCurrentUser() helper
lib/email.ts                # Resend email integration
```

### Pages

```
app/page.tsx                           # Login page (/)
app/auth/set-password/page.tsx         # Magic link password setup
app/auth/forgot-password/page.tsx      # Password reset request (scaffold)
app/auth/reset-password/page.tsx       # Password reset with code (scaffold)
app/dashboard/admin/users/page.tsx     # User management (ADMIN only)
```

### Components

```
components/auth/login-form.tsx              # Login form
components/auth/set-password-form.tsx       # Set password form
components/auth/forgot-password-form.tsx    # Forgot password form (scaffold)
components/auth/reset-password-form.tsx     # Reset password form (scaffold)
components/auth/log-out-button.tsx          # Logout button
components/admin/users-management-page.tsx  # User management UI
```

### API Routes

```
app/api/auth/[...nextauth]/route.ts         # NextAuth API
app/api/auth/set-password/route.ts          # Set password endpoint
app/api/admin/users/route.ts                # List & create users
app/api/admin/users/[userId]/route.ts       # Delete user
app/api/admin/users/[userId]/resend-invite/route.ts  # Resend invite
```

### Database

```
prisma/schema.prisma                   # Updated with User, UserInvite, UserRole
prisma/seedUsers.ts                    # Seed admin and dev users
```

## Usage

### Login

1. Navigate to `/`
2. Enter username and password
3. Click "Continue"
4. Redirected to `/dashboard` on success

### Create New User (Admin Only)

1. Navigate to `/dashboard/admin/users`
2. Click "Add User"
3. Fill in name, username, email, and role
4. Click "Create User"
5. Invite email sent automatically with magic link

### Set Password (New User)

1. User receives invite email
2. Clicks "Set Your Password" button
3. Enters password (min 8 characters)
4. Confirms password
5. Automatically logged in and redirected to `/dashboard`

### Resend Invite (Admin)

1. Go to `/dashboard/admin/users`
2. Find user with "Invite Expired" status
3. Click resend icon (↻)
4. New invite email sent with fresh token

### Delete User (Admin)

1. Go to `/dashboard/admin/users`
2. Find user to delete
3. Click delete icon (🗑️)
4. Confirm deletion
5. User and their invite deleted

### Logout

1. Click "Log out" button (usually in header/nav)
2. Session cleared
3. Redirected to `/`

## Session Data

The session object includes:

```typescript
{
  user: {
    id: string;           // User ID from database
    name: string;         // User's full name
    username: string;     // Unique username
    email: string;        // Email address
    role: string;         // ADMIN, MARKETING, SUPPORT, SALES, HR, DEV
  }
}
```

### Access Session in Components

**Client Component:**
```typescript
import { useSession } from "next-auth/react";

export function MyComponent() {
  const { data: session } = useSession();
  return <div>{session?.user?.name}</div>;
}
```

**Server Component:**
```typescript
import { auth } from "@/auth";

export default async function MyPage() {
  const session = await auth();
  return <div>{session?.user?.name}</div>;
}
```

**Server Action:**
```typescript
import { auth } from "@/auth";

export async function myAction() {
  const session = await auth();
  const userId = session?.user?.id;
  // ...
}
```

### Get Current User (for Activity Logging)

```typescript
import { getCurrentUser } from "@/lib/auth-helpers";

export async function logActivity(leadId: string, type: string) {
  const user = await getCurrentUser();
  
  await prisma.activity.create({
    data: {
      leadId,
      type,
      performedBy: user?.name || "System",
    },
  });
}
```

## Route Protection

### Public Routes (No Auth Required)

- `/` - Login page
- `/api/auth/*` - NextAuth endpoints
- `/auth/set-password` - Magic link password setup
- `/auth/forgot-password` - Password reset request
- `/auth/reset-password` - Password reset

### Protected Routes (Auth Required)

- `/dashboard/*` - All dashboard routes
- `/api/admin/*` - Admin API endpoints
- Any other route not in public list

### Role-Based Access

Some routes check role in the page component:

```typescript
// /dashboard/admin/users/page.tsx
if (session?.user?.role !== "ADMIN") {
  redirect("/dashboard");
}
```

## Email Templates

### Invite Email

Sent when admin creates a new user. Contains:
- Welcome message
- Magic link button
- Direct link (for copying)
- 24-hour expiry notice

### Password Reset Email (TODO)

Placeholder for future implementation. Should contain:
- Reset code or link
- Expiry information
- Instructions

## Troubleshooting

### "Invalid username or password"

- Check username and password are correct
- Verify user exists in database
- Ensure password was set (not pending invite)

### "Your invite link has expired"

- Admin must resend invite
- New token will be generated
- User receives new email

### "Cannot delete your own account"

- Admin cannot delete their own account
- Delete a different user first, or ask another admin

### "DEV users cannot be deleted"

- DEV users are protected
- Only visible in database, not admin UI
- For testing/development only

### Email not received

- Check RESEND_API_KEY is valid
- Verify EMAIL_FROM is configured
- Check email spam folder
- Ensure APP_URL is correct in email links

### Session not persisting

- Verify NEXTAUTH_SECRET is set
- Check cookies are enabled in browser
- Ensure middleware.ts is protecting routes correctly

## Password Requirements

- Minimum 8 characters
- No other complexity requirements (customize as needed)

To add complexity requirements, update `set-password-form.tsx` validation.

## Security Considerations

1. **Password Hashing** - bcryptjs with 10 salt rounds
2. **Token Generation** - crypto.randomBytes(32) for 256-bit tokens
3. **Token Expiry** - 24 hours for invite links
4. **Single-Use Tokens** - Deleted after password set
5. **Role-Based Access** - ADMIN-only pages redirect non-admins
6. **DEV Users Hidden** - Not visible in admin UI
7. **Session JWT** - Signed with NEXTAUTH_SECRET
8. **HTTPS Required** - In production, set secure cookies

## Customization

### Change Invite Expiry

In `app/api/admin/users/route.ts` and `app/api/admin/users/[userId]/resend-invite/route.ts`:

```typescript
const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours
```

### Add Password Complexity

In `components/auth/set-password-form.tsx`:

```typescript
const hasUppercase = /[A-Z]/.test(password);
const hasNumber = /\d/.test(password);
const isStrong = password.length >= 8 && hasUppercase && hasNumber;
```

### Customize Email Template

In `lib/email.ts`, update the HTML in `sendInviteEmail()`.

### Add More Roles

In `prisma/schema.prisma`, add to `UserRole` enum:

```prisma
enum UserRole {
  ADMIN
  MARKETING
  SUPPORT
  SALES
  HR
  DEV
  CUSTOM_ROLE  // Add here
}
```

Then run `npx prisma generate` and `npx prisma db push`.

## Testing

### Test Login

```bash
npm run dev
# Visit http://localhost:3000
# Login with admin/dev credentials
```

### Test User Creation

```bash
# As admin user
# Navigate to /dashboard/admin/users
# Create a test user
# Check email for invite link
```

### Test Invite Link

```bash
# Copy token from email link
# Visit /auth/set-password?token=<token>
# Set password
# Should auto-login and redirect to /dashboard
```

## Production Deployment

1. Set `NEXTAUTH_URL` to production domain
2. Generate new `NEXTAUTH_SECRET` for production
3. Update `APP_URL` to production domain
4. Configure Resend with production email domain
5. Set `secure: true` in cookies (automatic in production)
6. Use production MongoDB connection string
7. Run migrations on production database

## Support

For NextAuth.js documentation: https://authjs.dev/
For Resend documentation: https://resend.com/docs
