import { UserRole } from "@prisma/client";
import {
  ROLE_CONFIG,
  ASSIGNABLE_ROLE_CONFIG,
  AssignableRole,
} from "@/config/field-controls-config";
import { UpdateDropdown, UpdateDropdownProps } from "../shared/update-dropdown";
import { Chip } from "@/components/ui/controls/chip";
import { updateTeamMemberRoleAction } from "@/lib/server/team/actions/write/updateTeamMemberRoleAction";
import { toast } from "sonner";
import { isProtectedRole } from "@/lib/auth/rbac";

export interface RoleDropdownProps extends Omit<
  UpdateDropdownProps<AssignableRole>,
  "current" | "config" | "onUpdateChange"
> {
  userId: string;
  currentRole: UserRole;
  currentUserId?: string;
}

export function RoleDropdown({
  userId,
  currentRole,
  currentUserId,
  ...props
}: RoleDropdownProps) {
  const isProtected = isProtectedRole(currentRole);
  const isSelf = currentUserId === userId;

  // Show non-interactive chip for protected roles or current user's own role
  if (isProtected || isSelf) {
    return (
      <Chip
        variant={ROLE_CONFIG[currentRole].variant}
        intent="soft"
        size="sm"
        className="pointer-events-none"
        {...props}
      >
        {ROLE_CONFIG[currentRole].label}
      </Chip>
    );
  }

  // Guard against DEV or any other non-assignable role
  if (!(currentRole in ASSIGNABLE_ROLE_CONFIG)) {
    return null;
  }

  const handleRoleChange = async (newRole: AssignableRole) => {
    const result = await updateTeamMemberRoleAction(userId, newRole);

    if (result.success) {
      toast.success(`Role updated to ${ASSIGNABLE_ROLE_CONFIG[newRole].label}`);
    } else {
      toast.error(result.error || "Failed to update role");
    }
  };

  // Type-safe: currentRole is now guaranteed to be AssignableRole after the guard
  const assignableRole = currentRole as AssignableRole;

  return (
    <UpdateDropdown
      current={assignableRole}
      config={ASSIGNABLE_ROLE_CONFIG}
      onUpdateChange={handleRoleChange}
      aria-label={`Current role: ${ASSIGNABLE_ROLE_CONFIG[assignableRole].label}. Click to change role.`}
      intent="soft"
      {...props}
    />
  );
}
