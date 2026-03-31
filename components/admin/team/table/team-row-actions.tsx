import { TeamMember } from "@/lib/server/read/getTeamMembers";
import { Button } from "@/components/ui/controls";
import { useState, memo } from "react";
import { Trash2, RotateCcw, Ellipsis, Pencil } from "lucide-react";
import { isAdminRole, isProtectedRole } from "@/lib/auth/constants";
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
// Team Row Actions
// ============================================================

export const TeamRowActions = memo(function TeamRowActions({
  member,
}: {
  member: TeamMember;
}) {
  const { data: session } = useSession();
  const currentUserRole = session?.user?.role;
  const [isResending, setIsResending] = useState(false);

  const isProtected = isProtectedRole(member.role);
  const optionsAuth = !isAdminRole(currentUserRole);

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
              Edit {isProtected ? "Owner" : "Member"}
            </DropdownMenuItem>
          </DialogTrigger>

          <DropdownMenuItem
            onClick={handleResendInvite}
            disabled={isResending || isProtected}
          >
            <RotateCcw className="size-4" />
            Resend Invite
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuGroup>
          <AlertDialogTrigger
            asChild
            dialogType={ALERT_DIALOG_TYPES.DELETE_MEMBER}
            payload={{ userId: member.id }}
            disabled={isProtected}
          >
            <DropdownMenuItem variant="destructive">
              <Trash2 aria-hidden="true" />
              Delete Member
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
