import { TeamMember } from "@/lib/server/read/getTeamMembers";
import { Button } from "@/components/ui/controls";
import { useState, memo } from "react";
import { Trash2, RotateCcw, Ellipsis, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/layout/dropdown-menu";
import { AlertDialogTrigger } from "@/components/ui/feedback/alert-dialog";
import { DialogTrigger } from "@/components/ui/feedback/dialog";
import { ALERT_DIALOG_TYPES, DIALOG_TYPES } from "@/types/ui/dialog";
import { UserRole } from "@prisma/client";
import { resendTeamMemberInviteAction } from "@/lib/server/actions/write/resendTeamMemberInviteAction";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

// ============================================================
// Types
// ============================================================

interface TeamRowActionsProps {
  member: TeamMember;
  isCurrentUser: boolean;
}

// ============================================================
// Utilities
// ============================================================

function isInviteExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date();
}

// ============================================================
// Team Row Actions
// ============================================================

export const TeamRowActions = memo(function TeamRowActions({
  member,
  isCurrentUser,
}: TeamRowActionsProps) {
  const { data: session } = useSession();
  const currentUserRole = session?.user?.role;
  const [isResending, setIsResending] = useState(false);

  const isProtectedRole = member.role === "OWNER";

  const optionsAuth = !["ADMIN", "OWNER"].includes(currentUserRole ?? "");

  const canDelete =
    !isCurrentUser && member.role !== "DEV" && member.role !== "OWNER";
  const canResendInvite =
    !member.password &&
    !!member.invite &&
    isInviteExpired(member.invite.expiresAt);
  const canEdit = !isCurrentUser && member.role !== "DEV";

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={optionsAuth}>
        <Button
          size="sm"
          intent="ghost"
          mode="iconOnly"
          aria-label={`Actions for ${member.name}`}
          title={`Actions for ${member.name}`}
        >
          <Ellipsis className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          {/* <DropdownMenuItem onClick={handleEdit}>
            <Pencil className="size-4" />
            Edit Member
          </DropdownMenuItem> */}
          <DialogTrigger
            asChild
            dialogType={DIALOG_TYPES.EDIT_MEMBER}
            payload={{
              userId: member.id,
              initialFormData: {
                name: member?.name ?? "",
                email: member?.email ?? "",
                role: (member?.role as UserRole) ?? "",
              },
              hasPendingInvite: !!member.invite,
            }}
          >
            <DropdownMenuItem>
              <Pencil aria-hidden="true" />
              Edit {isProtectedRole ? "Owner" : "Member"}
            </DropdownMenuItem>
          </DialogTrigger>

          {!isProtectedRole && (
            <DropdownMenuItem
              onClick={handleResendInvite}
              disabled={isResending}
            >
              <RotateCcw className="size-4" />
              Resend Invite
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        {!isProtectedRole && (
          <DropdownMenuGroup>
            <AlertDialogTrigger
              asChild
              dialogType={ALERT_DIALOG_TYPES.DELETE_MEMBER}
              payload={{ userId: member.id }}
            >
              <DropdownMenuItem variant="destructive">
                <Trash2 aria-hidden="true" />
                Delete Member
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
