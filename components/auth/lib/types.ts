// ==============================================
// Types
// ==============================================

export type FieldKey = "username" | "email" | "password" | "confirmPassword";

export type FormState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "success" }
  | {
      status: "error";
      error: string;
      field?: FieldKey;
    };
