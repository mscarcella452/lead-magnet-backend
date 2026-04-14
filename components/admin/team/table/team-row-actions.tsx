import { TeamMember } from "@/lib/server/team/read/getTeamMembers";
import { Button } from "@/components/ui/controls";
import { useState, memo } from "react";
import { Trash2, RotateCcw, Ellipsis } from "lucide-react";
import { isAdminRole, isProtectedRole } from "@/lib/auth/rbac";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/layout/dropdown-menu";
import { AlertDialogTrigger } from "@/components/ui/feedback/alert-dialog";
import { ALERT_DIALOG_TYPES } from "@/types/ui/dialog";
import { UserRole } from "@prisma/client";
import { resendTeamMemberInviteAction } from "@/lib/server/team/actions/write/resendTeamMemberInviteAction";
import { toast } from "sonner";
// ============================================================
// Team Row Actions
// ============================================================

export const TeamRowActions = memo(function TeamRowActions({
  member,
  currentUserRole,
  currentUserId,
}: {
  member: TeamMember;
  currentUserRole?: UserRole;
  currentUserId?: string;
}) {
  const [isResending, setIsResending] = useState(false);

  const isProtected = isProtectedRole(member.role);
  const isSelf = currentUserId === member.id;
  const isUnauthorized = !isAdminRole(currentUserRole);
  const cannotDelete = isProtected || isSelf || isUnauthorized;

  const handleResendInvite = async () => {
    setIsResending(true);
    try {
      const result = await resendTeamMemberInviteAction(member.id);
      if (result.success) {
        toast.success("Invite resent");
      } else {
        toast.error(result.error);
      }
    } finally {
      setIsResending(false);
    }
  };

  // User has accepted invite - only show delete button
  if (member.password) {
    // Don't show any actions if user cannot delete
    if (cannotDelete) return null;
    // return (
    //   <LockKeyhole
    //     aria-hidden="true"
    //     // match size to sm button of alert dialog trigger
    //     className="size-[1em] text-control-sm text-foreground opacity-50 mx-auto"
    //   />
    // );

    return (
      <AlertDialogTrigger
        asChild
        dialogType={ALERT_DIALOG_TYPES.DELETE_MEMBER}
        payload={{ userId: member.id }}
      >
        <Button
          variant="destructive"
          intent="ghost"
          size="sm"
          mode="iconOnly"
          aria-label="Delete Member"
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>
    );
  }

  // User has pending invite - show dropdown with resend and cancel invite
  // Don't show dropdown if unauthorized
  if (isUnauthorized || isProtected) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          intent="ghost"
          mode="iconOnly"
          aria-label={`Actions for ${member.name}`}
          title={`Actions for ${member.name}`}
        >
          <Ellipsis aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleResendInvite} disabled={isResending}>
            <RotateCcw aria-hidden="true" />
            Resend Invite
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuGroup>
          <AlertDialogTrigger
            asChild
            dialogType={ALERT_DIALOG_TYPES.DELETE_MEMBER}
            payload={{
              userId: member.id,
              isPendingInvite: true,
            }}
          >
            <DropdownMenuItem variant="destructive">
              <Trash2 aria-hidden="true" />
              Cancel Invite
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
