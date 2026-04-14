import type { FormState } from "@/lib/forms/useFormState";
import type { AuthFieldKey } from "./types";
import {
  AUTH_VALIDATION_MESSAGES as ERR,
  PASSWORD_MINIMUM_LENGTH,
} from "./constants";
import { isValidEmail } from "@/lib/utils/validation";
import { fieldError, requireField } from "@/lib/forms/utils";

// ==============================================================================
// Shared Validators
// ==============================================================================

const validateEmailField = (email: string): FormState<AuthFieldKey> | null =>
  requireField(email, ERR.email, "email") ??
  (isValidEmail(email) ? null : fieldError(ERR.emailInvalid, "email"));

const validatePasswordField = (
  password: string,
): FormState<AuthFieldKey> | null =>
  requireField(password, ERR.password, "password") ??
  (password.length < PASSWORD_MINIMUM_LENGTH
    ? fieldError(ERR.passwordLength, "password")
    : null);

// ==============================================================================
// Auth Validations
// ==============================================================================

/**
 * validateLogin
 * Used in: LoginForm, loginAction
 */
export const validateLogin = ({
  username,
  password,
}: {
  username: string;
  password: string;
}): FormState<AuthFieldKey> | null =>
  requireField(username, ERR.username, "username") ??
  requireField(password, ERR.password, "password");

/**
 * validateResetPassword
 * Used in: ResetPasswordForm, SetPasswordForm, validatePasswordChange
 */
export const validateResetPassword = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}): FormState<AuthFieldKey> | null =>
  validatePasswordField(password) ??
  requireField(confirmPassword, ERR.confirmPassword, "confirmPassword") ??
  (password !== confirmPassword
    ? fieldError(ERR.confirmPasswordMatch, ["password", "confirmPassword"])
    : null);

/**
 * validateAccountCreation
 * Used in: SetPasswordForm, setPasswordAction
 */
export const validateAccountCreation = ({
  username,
  password,
  confirmPassword,
}: {
  username: string;
  password: string;
  confirmPassword: string;
}): FormState<AuthFieldKey> | null =>
  requireField(username, ERR.username, "username") ??
  validateResetPassword({ password, confirmPassword });

/**
 * validatePasswordChange
 * Used in: PasswordChangeForm, changePasswordAction
 */
export const validatePasswordChange = ({
  currentPassword,
  password,
  confirmPassword,
}: {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}): FormState<AuthFieldKey> | null =>
  requireField(currentPassword, ERR.currentPassword, "currentPassword") ??
  validateResetPassword({ password, confirmPassword }) ??
  (currentPassword === password
    ? fieldError(ERR.passwordSame, "password")
    : null);

// ==============================================================================
// Email Validations
// ==============================================================================

/**
 * validateEmail
 * Used in: ForgotPasswordForm, forgotPasswordAction
 */
export const validateEmail = (email: string): FormState<AuthFieldKey> | null =>
  validateEmailField(email);

/**
 * validateEmailInput
 * Used in: EmailForm (before opening confirmation dialog)
 */
export const validateEmailInput = (
  email: string,
  confirmEmail: string,
): FormState<AuthFieldKey> | null =>
  validateEmailField(email) ??
  (email.toLowerCase() !== confirmEmail.toLowerCase()
    ? fieldError(ERR.emailMatch, ["email", "confirmEmail"])
    : null);

/**
 * validateEmailChange
 * Used in: AccountEmailChangeDialog, requestEmailChangeAction
 */
export const validateEmailChange = ({
  email,
  currentPassword,
}: {
  email: string;
  currentPassword: string;
}): FormState<AuthFieldKey> | null =>
  validateEmailField(email) ??
  requireField(currentPassword, ERR.currentPassword, "currentPassword");

// ==============================================================================
// Profile Validations
// ==============================================================================

/**
 * validateProfile
 * Used in: ProfileForm, updateProfileAction
 */
export const validateProfile = ({
  name,
  username,
}: {
  name: string;
  username: string;
}): FormState<AuthFieldKey> | null =>
  requireField(name, ERR.name, "name") ??
  requireField(username, ERR.username, "username");
