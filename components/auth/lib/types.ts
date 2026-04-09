// ==============================================
// Types
// ==============================================

export type FieldKey =
  | "username"
  | "email"
  | "password"
  | "confirmPassword"
  | "name"
  | "currentPassword";

export type FormState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "success" }
  | {
      status: "error";
      error: string;
      field?: FieldKey;
    };
