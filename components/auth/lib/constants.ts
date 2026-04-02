// ============================================================================
//  auth forms
// ============================================================================

export const VALIDATION_ERROR_MESSAGES = {
  username: "Username is required.",
  password: "Password is required.",
  confirmPassword: "Please confirm your password.",
  passwordLength: "Password must be at least 8 characters.",
  confirmPasswordMatch: "Passwords do not match.",
  email: "Email is required.",
  emailInvalid: "Please enter a valid email address.",
} as const;

export const PASSWORD_MINIMUM_LENGTH = 8;
