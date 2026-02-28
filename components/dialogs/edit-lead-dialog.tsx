"use client";

import { useState, useEffect } from "react";
import type { Lead } from "@/types";
import { updateLead } from "@/app/admin/actions";
import { toast } from "sonner";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogBody,
} from "@/components/ui/feedback/dialog";
import { Button } from "@/components/ui/controls";
import { Input } from "@/components/ui/controls";
import { Label } from "@/components/ui/label";
import { Container } from "@/components/ui/layout/containers";
import { useDialogs } from "@/components/dialogs/providers/dialog-provider";
import { Badge } from "@/components/ui/feedback/badge";
import { StatusDropdown } from "@/components/status";

interface LeadMetadata {
  phone?: string;
  company?: string;
  [key: string]: any;
}

export function EditLeadDialog({ id, name, email, source, metadata }: Lead) {
  const { closeDialog } = useDialogs();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: name || "",
    email: email || "",
    source: source || "",
    metadata: metadata || "",
  });

  // Update form data when props change
  useEffect(() => {
    setFormData({
      name: name || "",
      email: email || "",
      source: source || "",
      metadata: metadata || "",
    });
  }, [name, email, source, metadata]);

  console.log(metadata);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateLead(id, {
        name: formData.name,
        email: formData.email,
        source: formData.source || undefined,
      });

      if (result.success) {
        toast.success("Lead updated");
        closeDialog();
      } else {
        toast.error(result.error || "Failed to update lead");
      }
    } catch (error) {
      toast.error("Failed to update lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent layout="responsiveModal" className="overflow-y-auto">
      <Container spacing="content" className="@container">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Edit Lead</DialogTitle>
          <Badge variant="brand" intent="soft">
            New
          </Badge>
          {/* <StatusDropdown currentStatus={formData.status} onStatusChange={(status) => setFormData({ ...formData, status })} /> */}
        </DialogHeader>

        <DialogBody>
          {/* <form id="edit-lead-form" onSubmit={handleSubmit}>
            <Container spacing="block">
              <Container spacing="item">
                <Label htmlFor="name" className="text-xs text-muted-foreground">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </Container>

              <Container spacing="item">
                <Label
                  htmlFor="email"
                  className="text-xs text-muted-foreground"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </Container>

              <Container spacing="block" className="flex @lg:flex-row">
                <Container spacing="item">
                  <Label
                    htmlFor="phone"
                    className="text-xs text-muted-foreground"
                  >
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="text"
                    value={(formData.metadata as LeadMetadata)?.phone}
                    // onChange={(e) =>
                    //   setFormData({ ...formData, email: e.target.value })
                    // }
                    // required
                  />
                </Container>
                <Container spacing="item">
                  <Label
                    htmlFor="company"
                    className="text-xs text-muted-foreground"
                  >
                    Company
                  </Label>
                  <Input
                    id="company"
                    type="text"
                    value={(formData.metadata as LeadMetadata)?.company}
                    // onChange={(e) =>
                    //   setFormData({ ...formData, email: e.target.value })
                    // }
                    // required
                  />
                </Container>
              </Container>

              <Container spacing="item">
                <Label
                  htmlFor="source"
                  className="text-xs text-muted-foreground"
                >
                  Source
                </Label>
                <Input
                  id="source"
                  value={formData.source}
                  onChange={(e) =>
                    setFormData({ ...formData, source: e.target.value })
                  }
                  placeholder="e.g., website-homepage"
                />
              </Container>
            </Container>
          </form> */}
        </DialogBody>

        {/* <DialogFooter>
          <Container
            spacing="group"
            className="flex-col-reverse @lg:flex-row @lg:justify-end"
          >
            <Button
              type="button"
              intent="outline"
              size="sm"
              onClick={closeDialog}
              disabled={isSubmitting}
              className="@max-lg:h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="edit-lead-form"
              size="sm"
              disabled={isSubmitting}
              className="@max-lg:h-11"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </Container>
        </DialogFooter> */}
      </Container>
    </DialogContent>
  );
}
