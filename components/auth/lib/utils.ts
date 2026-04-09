import { type FormState, type FieldKey } from "./types";
import {
  VALIDATION_ERROR_MESSAGES as ERR,
  PASSWORD_MINIMUM_LENGTH,
} from "./constants";
import { isValidEmail } from "@/lib/utils/validation";

// ============================================================================
// CORE HELPERS
// ============================================================================

export const fieldError = (
  errorMessage: string,
  field: FieldKey,
): FormState => ({
  status: "error",
  error: errorMessage,
  field,
});

/** Returns a fieldError if value is falsy, otherwise null */
const requireField = (
  value: string,
  message: string,
  field: FieldKey,
): FormState | null => (value ? null : fieldError(message, field));

/** Validates email format, assumes non-empty value */
const validateEmailFormat = (email: string): FormState | null =>
  isValidEmail(email) ? null : fieldError(ERR.emailInvalid, "email");

// ============================================================================
// SHARED VALIDATORS
// ============================================================================

const validateEmailField = (email: string): FormState | null =>
  requireField(email, ERR.email, "email") ?? validateEmailFormat(email);

const validatePasswordField = (password: string): FormState | null =>
  requireField(password, ERR.password, "password") ??
  (password.length < PASSWORD_MINIMUM_LENGTH
    ? fieldError(ERR.passwordLength, "password")
    : null);

// ============================================================================
// AUTH VALIDATIONS
// ============================================================================

// ----------------------------------------------------------------------------
// validateLogin
/** Used in: LoginForm, loginAction */
// ----------------------------------------------------------------------------

export const validateLogin = ({
  username,
  password,
}: {
  username: string;
  password: string;
}): FormState | null =>
  requireField(username, ERR.username, "username") ??
  requireField(password, ERR.password, "password");

// ----------------------------------------------------------------------------
// validateResetPassword
/** Used in: ResetPasswordForm, SetPasswordForm, validatePasswordChange */
// ----------------------------------------------------------------------------
export const validateResetPassword = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}): FormState | null =>
  validatePasswordField(password) ??
  requireField(confirmPassword, ERR.confirmPassword, "confirmPassword") ??
  (password !== confirmPassword
    ? fieldError(ERR.confirmPasswordMatch, "confirmPassword")
    : null);

// ----------------------------------------------------------------------------
// validateAccountCreation
/** Used in: SetPasswordForm, setPasswordAction */
// ----------------------------------------------------------------------------
export const validateAccountCreation = ({
  username,
  password,
  confirmPassword,
}: {
  username: string;
  password: string;
  confirmPassword: string;
}): FormState | null =>
  requireField(username, ERR.username, "username") ??
  validateResetPassword({ password, confirmPassword });

// ----------------------------------------------------------------------------
// validatePasswordChange
/** Used in: PasswordChangeForm, changePasswordAction */
// ----------------------------------------------------------------------------
export const validatePasswordChange = ({
  currentPassword,
  password,
  confirmPassword,
}: {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}): FormState | null =>
  requireField(currentPassword, ERR.currentPassword, "currentPassword") ??
  validateResetPassword({ password, confirmPassword });

// ============================================================================
// EMAIL VALIDATIONS
// ============================================================================

// ----------------------------------------------------------------------------
// validateEmail
/** Used in: ForgotPasswordForm, forgotPasswordAction */
// ----------------------------------------------------------------------------
export const validateEmail = (email: string): FormState | null =>
  validateEmailField(email);

// ----------------------------------------------------------------------------
// validateEmailInput
/** Used in: EmailForm (before opening confirmation dialog) */
// ----------------------------------------------------------------------------
export const validateEmailInput = (
  email: string,
  confirmEmail: string,
): FormState | null =>
  validateEmailField(email) ??
  (email !== confirmEmail ? fieldError(ERR.emailMatch, "email") : null);

// ----------------------------------------------------------------------------
// validateEmailChange
/** Used in: AccountEmailChangeDialog, requestEmailChangeAction */
// ----------------------------------------------------------------------------
export const validateEmailChange = ({
  email,
  currentPassword,
}: {
  email: string;
  currentPassword: string;
}): FormState | null =>
  validateEmailField(email) ??
  requireField(currentPassword, ERR.currentPassword, "currentPassword");

// ============================================================================
// PROFILE VALIDATIONS
// ============================================================================

// ----------------------------------------------------------------------------
// validateProfile
/** Used in: ProfileForm, updateProfileAction */
// ----------------------------------------------------------------------------
export const validateProfile = ({
  name,
  username,
}: {
  name: string;
  username: string;
}): FormState | null =>
  requireField(name, ERR.name, "name") ??
  requireField(username, ERR.username, "username");
