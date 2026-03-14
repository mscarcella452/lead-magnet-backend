# NextAuth.js Setup Checklist

Use this checklist to verify your NextAuth.js v5 setup is complete and working.

## Pre-Setup

- [ ] Node.js 18+ installed
- [ ] MongoDB connection string ready
- [ ] Resend account created (optional but recommended)
- [ ] Resend API key obtained

## Installation

- [ ] Run `npm install`
- [ ] Verify no installation errors
- [ ] Check `node_modules` contains `next-auth`, `bcryptjs`, `resend`

## Database Setup

- [ ] Run `npx prisma generate`
- [ ] Verify Prisma client generated successfully
- [ ] Run `npx prisma db push`
- [ ] Verify MongoDB collections created:
  - [ ] `users` collection exists
  - [ ] `user_invites` collection exists

## Environment Variables

- [ ] Create `.env.local` file
- [ ] Set `DATABASE_URL` to MongoDB connection string
- [ ] Generate `NEXTAUTH_SECRET` with `openssl rand -base64 32`
- [ ] Set `NEXTAUTH_SECRET` in `.env.local`
- [ ] Set `NEXTAUTH_URL` to `http://localhost:3000` (dev)
- [ ] Set `ADMIN_NAME` (e.g., "Admin User")
- [ ] Set `ADMIN_USERNAME` (e.g., "admin")
- [ ] Set `ADMIN_EMAIL` (e.g., "admin@example.com")
- [ ] Set `ADMIN_PASSWORD` (strong password)
- [ ] Set `DEV_NAME` (e.g., "Developer")
- [ ] Set `DEV_USERNAME` (e.g., "dev")
- [ ] Set `DEV_EMAIL` (e.g., "dev@example.com")
- [ ] Set `DEV_PASSWORD` (strong password)
- [ ] Set `RESEND_API_KEY` (from Resend dashboard)
- [ ] Set `EMAIL_FROM` (e.g., "noreply@yourdomain.com")
- [ ] Set `APP_URL` to `http://localhost:3000` (dev)

## Seeding

- [ ] Run `npm run seed:users`
- [ ] Verify no errors in output
- [ ] Check admin user created:
  - [ ] Username: admin
  - [ ] Email: (from ADMIN_EMAIL)
- [ ] Check dev user created:
  - [ ] Username: dev
  - [ ] Email: (from DEV_EMAIL)

## Development Server

- [ ] Run `npm run dev`
- [ ] Verify server starts without errors
- [ ] Check console for any warnings

## Login Page Testing

- [ ] Navigate to `http://localhost:3000`
- [ ] Verify login form displays:
  - [ ] Username input field
  - [ ] Password input field
  - [ ] "Continue" button
- [ ] Test login with admin credentials:
  - [ ] Username: admin
  - [ ] Password: (from ADMIN_PASSWORD)
- [ ] Verify redirect to `/dashboard` on success
- [ ] Test failed login:
  - [ ] Enter wrong password
  - [ ] Verify error message displays
  - [ ] Verify error doesn't reveal if username exists

## Dashboard Access

- [ ] Verify `/dashboard` page loads
- [ ] Verify authenticated user can see dashboard
- [ ] Verify logout button exists
- [ ] Test logout:
  - [ ] Click logout button
  - [ ] Verify redirect to `/`
  - [ ] Verify session cleared

## Admin Users Page

- [ ] Navigate to `/dashboard/admin/users`
- [ ] Verify page loads (ADMIN only)
- [ ] Verify users table displays:
  - [ ] Admin user listed
  - [ ] Dev user NOT listed (hidden)
- [ ] Verify columns:
  - [ ] Name
  - [ ] Username
  - [ ] Email
  - [ ] Role
  - [ ] Status
  - [ ] Created date
  - [ ] Actions

## Create User Flow

- [ ] Click "Add User" button
- [ ] Verify form displays:
  - [ ] Name input
  - [ ] Username input
  - [ ] Email input
  - [ ] Role dropdown
- [ ] Fill in test user details:
  - [ ] Name: "Test User"
  - [ ] Username: "testuser"
  - [ ] Email: "test@example.com"
  - [ ] Role: "SALES"
- [ ] Click "Create User"
- [ ] Verify success message displays
- [ ] Verify user appears in table with "Pending Setup" status

## Email Testing

- [ ] Check email inbox for invite email
- [ ] Verify email contains:
  - [ ] Welcome message
  - [ ] "Set Your Password" button
  - [ ] Direct link to set-password page
  - [ ] 24-hour expiry notice
- [ ] Verify email from address matches `EMAIL_FROM`

## Set Password Flow

- [ ] Click "Set Your Password" button in email
- [ ] Verify redirected to `/auth/set-password?token=xxx`
- [ ] Verify form displays:
  - [ ] Password input
  - [ ] Confirm password input
  - [ ] Password requirements list
- [ ] Enter password (min 8 characters)
- [ ] Confirm password
- [ ] Click "Set Password"
- [ ] Verify success and auto-login
- [ ] Verify redirect to `/dashboard`

## Resend Invite Flow

- [ ] Go back to `/dashboard/admin/users`
- [ ] Find test user with "Invite Expired" status
- [ ] Click resend icon (↻)
- [ ] Verify success message
- [ ] Check email for new invite
- [ ] Verify new token in link

## Delete User Flow

- [ ] Create another test user
- [ ] Find test user in table
- [ ] Click delete icon (🗑️)
- [ ] Verify confirmation dialog
- [ ] Confirm deletion
- [ ] Verify user removed from table
- [ ] Verify success message

## Role-Based Access

- [ ] Logout as admin
- [ ] Login as dev user
- [ ] Try to navigate to `/dashboard/admin/users`
- [ ] Verify redirect to `/dashboard` (access denied)
- [ ] Verify dev user cannot access admin pages

## Session Persistence

- [ ] Login as admin
- [ ] Refresh page (Ctrl+R)
- [ ] Verify session persists
- [ ] Verify still logged in
- [ ] Close browser tab
- [ ] Open new tab and navigate to `/dashboard`
- [ ] Verify redirected to `/` (session lost)

## Error Handling

- [ ] Test invalid token:
  - [ ] Navigate to `/auth/set-password?token=invalid`
  - [ ] Verify error message
  - [ ] Verify redirect to `/`
- [ ] Test expired token:
  - [ ] Wait for invite to expire (or manually set expiry in DB)
  - [ ] Click expired invite link
  - [ ] Verify "Your invite link has expired" message
  - [ ] Verify redirect to `/`

## Documentation

- [ ] Read `NEXTAUTH_SETUP.md`
- [ ] Read `AUTH_QUICK_REFERENCE.md`
- [ ] Read `IMPLEMENTATION_SUMMARY.md`
- [ ] Understand authentication flow
- [ ] Understand user invitation flow

## Production Preparation

- [ ] Set `NEXTAUTH_URL` to production domain
- [ ] Generate new `NEXTAUTH_SECRET` for production
- [ ] Update `APP_URL` to production domain
- [ ] Configure Resend with production email domain
- [ ] Update MongoDB connection string for production
- [ ] Test on staging environment
- [ ] Verify HTTPS enabled
- [ ] Verify secure cookies set

## Troubleshooting

If any step fails:

1. Check console for error messages
2. Review relevant documentation file
3. Verify environment variables are set correctly
4. Check MongoDB connection
5. Verify Resend API key is valid
6. Clear browser cache and cookies
7. Restart development server

## Sign-Off

- [ ] All checklist items completed
- [ ] No errors in console
- [ ] All features tested and working
- [ ] Ready for development
- [ ] Ready for production deployment

---

**Date Completed:** _______________

**Completed By:** _______________

**Notes:** 
