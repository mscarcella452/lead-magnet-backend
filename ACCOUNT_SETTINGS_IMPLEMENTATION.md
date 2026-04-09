# Account Settings Page Implementation

## Overview
Built a complete account settings page at `/account` following the exact patterns established in the codebase. The page allows users to update their profile, email, and password with proper validation and security measures.

## Architecture

### Server Component Page
- **Location**: `app/(dashboard)/account/page.tsx`
- Reads session via `auth()` and passes user data down as props
- Redirects unauthenticated users to login
- Displays three separate forms in Card components
- Shows role as read-only Badge

### Client Form Components
All forms use the shared `useAuthForm` hook and follow established patterns:

1. **ProfileForm** (`components/account/profile-form.tsx`)
   - Updates `name` and `username`
   - Validates username uniqueness (excluding current user)
   - Shows current values as defaultValue
   - Success toast on update

2. **EmailForm** (`components/account/email-form.tsx`)
   - Updates `email` with password confirmation
   - Generates verification token (24-hour expiry)
   - Sends verification email (TODO: implement email sending)
   - Does NOT update email immediately - requires verification
   - Success toast informs user to check inbox

3. **PasswordForm** (`components/account/password-form.tsx`)
   - Requires current password field
   - Uses shared `PasswordCreationFields` component
   - Validates new password is different from current
   - Success toast on update
   - Form resets after successful update

### Server Actions
All actions follow the `FormState` pattern and return `{ status: "success" | "error" | "idle" | "pending" }`:

1. **updateProfileAction** (`lib/server/actions/write/updateProfileAction.ts`)
   - Validates with `validateProfile`
   - Maps errors: `unauthorized`, `username_taken`
   - Returns success without redirect

2. **requestEmailChangeAction** (`lib/server/actions/write/requestEmailChangeAction.ts`)
   - Validates with `validateEmailChange`
   - Maps errors: `unauthorized`, `invalid_password`, `email_taken`
   - Returns success without redirect

3. **updatePasswordAction** (`lib/server/actions/write/updatePasswordAction.ts`)
   - Validates with `validatePasswordChange`
   - Maps errors: `unauthorized`, `invalid_password`, `password_same`
   - Returns success without redirect

### Service Functions
All service functions are server-only and handle Prisma operations:

1. **updateProfile** (`lib/server/write/updateProfile.ts`)
   - Checks username uniqueness (excluding current user)
   - Updates name and username
   - Throws named errors

2. **requestEmailChange** (`lib/server/write/requestEmailChange.ts`)
   - Verifies current password with bcrypt
   - Checks email uniqueness
   - Generates 24-hour verification token
   - Stores token in `EmailVerificationToken` model
   - TODO: Send verification email

3. **updatePassword** (`lib/server/write/updatePassword.ts`)
   - Verifies current password with bcrypt
   - Validates new password is different from current
   - Hashes new password with bcrypt (10 rounds)
   - Updates user password

### Validation Utilities
Added to `components/auth/lib/utils.ts`:

1. **validateProfile({ name, username })**
   - Checks required fields

2. **validateEmailChange({ email, currentPassword })**
   - Validates email format
   - Checks required password

3. **validatePasswordChange({ currentPassword, password, confirmPassword })**
   - Validates current password required
   - Reuses `validateResetPassword` for new password validation

### Database Schema
Added `EmailVerificationToken` model to `prisma/schema.prisma`:
```prisma
model EmailVerificationToken {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token     String   @unique
  newEmail  String
  expiresAt DateTime
  createdAt DateTime @default(now())

  @@map("email_verification_tokens")
}
```

Added relation to User model:
```prisma
emailVerificationToken EmailVerificationToken?
```

### Type Updates
Updated `components/auth/lib/types.ts`:
- Added `"name"` and `"currentPassword"` to `FieldKey` type

Updated `components/auth/lib/constants.ts`:
- Added validation messages: `name`, `currentPassword`, `passwordSame`

## Security Features

1. **Password Verification**
   - Email and password changes require current password confirmation
   - Uses bcrypt.compare for secure verification

2. **Username Uniqueness**
   - Checks against all users except current user
   - Prevents duplicate usernames

3. **Email Uniqueness**
   - Checks against all users except current user
   - Prevents duplicate emails

4. **Password Strength**
   - Minimum 8 characters (enforced by existing validation)
   - Must match confirmation
   - Cannot be same as current password

5. **Email Verification**
   - Email changes require verification before taking effect
   - 24-hour token expiry
   - Single-use tokens (old tokens deleted when new one created)

## UI/UX Features

1. **Form State Management**
   - Uses shared `useAuthForm` hook
   - Field-level error clearing on input change
   - Pending state during submission
   - Success toasts via sonner

2. **Error Display**
   - `FormMotionAlertContainer` for animated error messages
   - Field-specific error targeting
   - ARIA attributes for accessibility

3. **Layout**
   - Max-width container (3xl) for readability
   - Card-based sections with clear titles and descriptions
   - Consistent spacing using Container components
   - Role displayed as read-only Badge

## Files Created

### Components
- `components/account/profile-form.tsx`
- `components/account/email-form.tsx`
- `components/account/password-form.tsx`

### Server Actions
- `lib/server/actions/write/updateProfileAction.ts`
- `lib/server/actions/write/requestEmailChangeAction.ts`
- `lib/server/actions/write/updatePasswordAction.ts`

### Service Functions
- `lib/server/write/updateProfile.ts`
- `lib/server/write/requestEmailChange.ts`
- `lib/server/write/updatePassword.ts`

### Pages
- `app/(dashboard)/account/page.tsx`

## Files Modified

- `prisma/schema.prisma` - Added EmailVerificationToken model
- `components/auth/lib/types.ts` - Added new FieldKey values
- `components/auth/lib/constants.ts` - Added new validation messages
- `components/auth/lib/utils.ts` - Added validation functions

## Email Verification Flow (COMPLETED)

### Service Function
- **verifyEmailChange** (`lib/server/write/verifyEmailChange.ts`)
  - Validates token and expiry
  - Updates user email to newEmail
  - Deletes verification token
  - Throws named errors: `invalid_token`, `token_expired`

### Server Action
- **verifyEmailChangeAction** (`lib/server/actions/write/verifyEmailChangeAction.ts`)
  - Calls `verifyEmailChange` service
  - Maps errors to FormState
  - Returns success on completion

### Email Sending
- **sendEmailVerificationEmail** (`lib/email.ts`)
  - Sends verification email to NEW email address
  - Includes verification link with token
  - 24-hour expiry notice
  - Professional HTML template

### Verification Page
- **Location**: `app/auth/verify-email/page.tsx`
- Auto-verifies token on page load
- Shows loading spinner during verification
- Shows success message with checkmark
- Auto-redirects to `/account` after 2 seconds
- Shows error message if verification fails

### Integration
- `requestEmailChange` now sends verification email
- If email sending fails, token is deleted and error thrown
- Email sent to NEW address (not current address)
- User must click link to complete email change

## Next Steps

1. **Session Update** (Optional Enhancement)
   - Consider updating session after profile/email changes
   - May need to call `update()` from next-auth to refresh session data
   - Currently requires re-login to see updated data in session

2. **Testing**
   - Test all form validations
   - Test error states (invalid token, expired token, email send failure)
   - Test success flows (profile update, email change, password change)
   - Test email verification flow end-to-end
   - Test with different user roles

3. **Production Considerations**
   - Ensure RESEND_API_KEY is set in production
   - Verify EMAIL_FROM domain is configured in Resend
   - Test email delivery in production environment
   - Consider rate limiting for email changes

## Usage

1. **Access Account Settings**: Navigate to `/account` while logged in
2. **Update Profile**: Change name/username and submit
3. **Change Email**: 
   - Enter new email and current password
   - Check new email inbox for verification link
   - Click link to verify and complete change
4. **Change Password**: Enter current password and new password

The page is protected and requires authentication.
