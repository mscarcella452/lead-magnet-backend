import type { TeamMemberFormData } from "@/lib/team/team-forms/types";
import { useState } from "react";
import { DEFAULT_FORM_DATA } from "@/lib/team/team-forms/constants";

// =====================================================
// useTeamMemberSteps
// =====================================================

type Step = "form" | "confirm";

interface UseTeamMemberStepsOptions {
  onBack?: () => void;
}

export const useTeamMemberSteps = (
  initialData = DEFAULT_FORM_DATA,
  options?: UseTeamMemberStepsOptions,
) => {
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState<TeamMemberFormData>(initialData);

  const handleValid = (data: TeamMemberFormData) => {
    setFormData(data);
    setStep("confirm");
  };

  const handleBack = () => {
    setStep("form");
    options?.onBack?.(); // Clear errors when going back
  };

  return { step, formData, handleValid, handleBack };
};
