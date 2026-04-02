import { type FormState, type FieldKey } from "./types";
import {
  VALIDATION_ERROR_MESSAGES,
  PASSWORD_MINIMUM_LENGTH,
} from "./constants";
import { isValidEmail } from "@/lib/utils/validation";

// ============================================================================
// auth fields validation
// ============================================================================

/**
 * Returns a FormState error object for a missing required field.
 * Used to keep client and server validation messages consistent.
 */

export const fieldError = (
  errorMessage: string,
  field: FieldKey,
): FormState => ({
  status: "error",
  error: errorMessage,
  field,
});

/**
 * Validates login form fields.
 * Returns the first FormState error found, or null if valid.
 */
interface ValidateLoginProps {
  username: string;
  password: string;
}

export const validateLogin = ({
  username,
  password,
}: ValidateLoginProps): FormState | null => {
  if (!username)
    return fieldError(VALIDATION_ERROR_MESSAGES.username, "username");
  if (!password)
    return fieldError(VALIDATION_ERROR_MESSAGES.password, "password");
  return null;
};

/**
 * Validates reset password form fields.
 * Returns the first FormState error found, or null if valid.
 */
interface ValidateResetPasswordProps {
  password: string;
  confirmPassword: string;
}

export const validateResetPassword = ({
  password,
  confirmPassword,
}: ValidateResetPasswordProps): FormState | null => {
  if (!password)
    return fieldError(VALIDATION_ERROR_MESSAGES.password, "password");
  if (!confirmPassword)
    return fieldError(
      VALIDATION_ERROR_MESSAGES.confirmPassword,
      "confirmPassword",
    );
  if (password.length < PASSWORD_MINIMUM_LENGTH) {
    return fieldError(VALIDATION_ERROR_MESSAGES.passwordLength, "password");
  }
  if (password !== confirmPassword) {
    return fieldError(
      VALIDATION_ERROR_MESSAGES.confirmPasswordMatch,
      "confirmPassword",
    );
  }
  return null;
};
/**
 * Validates account creation form fields.
 * Returns the first FormState error found, or null if valid.
 */
interface ValidateAccountCreationProps {
  username: string;
  password: string;
  confirmPassword: string;
}

export const validateAccountCreation = ({
  username,
  password,
  confirmPassword,
}: ValidateAccountCreationProps): FormState | null => {
  if (!username)
    return fieldError(VALIDATION_ERROR_MESSAGES.username, "username");
  const validationError = validateResetPassword({ password, confirmPassword });
  if (validationError) return validationError;
  return null;
};

/**
 * Validates forgot password form fields.
 * Returns the first FormState error found, or null if valid.
 */
export const validateEmail = (email: string): FormState | null => {
  if (!email) return fieldError(VALIDATION_ERROR_MESSAGES.email, "email");
  if (!isValidEmail(email))
    return fieldError(VALIDATION_ERROR_MESSAGES.emailInvalid, "email");
  return null;
};
