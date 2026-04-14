// ==============================================================================
// Auth Form Validation Messages
// ==============================================================================

export const AUTH_VALIDATION_MESSAGES = {
  username: "Username is required.",
  password: "Password is required.",
  confirmPassword: "Please confirm your password.",
  passwordLength: "Password must be at least 8 characters.",
  confirmPasswordMatch: "Passwords do not match.",
  email: "Email is required.",
  emailInvalid: "Please enter a valid email address.",
  emailMatch: "Emails do not match.",
  name: "Name is required.",
  currentPassword: "Current password is required.",
  passwordSame: "New password must be different from current password.",
} as const;

export const PASSWORD_MINIMUM_LENGTH = 8;
