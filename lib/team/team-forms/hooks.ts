import { useFormState } from "@/lib/forms/useFormState";
import type { TeamMemberFieldKey } from "./types";

// ==============================================================================
// useTeamMemberForm
// ==============================================================================

/**
 * Team member form state hook.
 * Wraps the generic useFormState with TeamMemberFieldKey type.
 */
export const useTeamMemberForm = () => useFormState<TeamMemberFieldKey>();
