import { CredentialsSignin } from "next-auth";

// ==============================================================================
// NextAuth Error Codes & Messages
// ==============================================================================

export type AuthErrorCode =
  | "user_not_found"
  | "invalid_credentials"
  | "password_not_set"
  | "missing_fields"
  | "default";

export const ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  user_not_found: "Username not found.",
  invalid_credentials: "Incorrect password.",
  password_not_set:
    "This account has not been set up yet. Check your email for an invite link.",
  missing_fields: "Please enter your username and password.",
  default: "Invalid username or password.",
};

// ==============================================================================
// NextAuth Custom Error Classes
// ==============================================================================

export class UserNotFoundError extends CredentialsSignin {
  code: AuthErrorCode = "user_not_found";
}

export class PasswordNotSetError extends CredentialsSignin {
  code: AuthErrorCode = "password_not_set";
}

export class InvalidCredentialsError extends CredentialsSignin {
  code: AuthErrorCode = "invalid_credentials";
}

export class MissingFieldsError extends CredentialsSignin {
  code: AuthErrorCode = "missing_fields";
}
