import { accordionVariants } from "@/design-system/cva-variants/accordion-variants";
import { alertDialogVariants } from "@/design-system/cva-variants/alert-dialog-variants";
import { avatarVariants } from "@/design-system/cva-variants/avatar-variants";
import { badgeVariants } from "@/design-system/cva-variants/badge-variants";
import { cardVariants } from "@/design-system/cva-variants/card-variants";
import { chipVariants } from "@/design-system/cva-variants/chip-variants";
import { containerVariants } from "@/design-system/cva-variants/container-variants";
import {
  dialogContentVariants,
  dialogLayoutVariants,
} from "@/design-system/cva-variants/dialog-variants";
import { inputVariants } from "@/design-system/cva-variants/input-variants";
import { selectTriggerVariants } from "@/design-system/cva-variants/select-variants";
import { controlVariants } from "@/design-system/cva-variants/control-variants";
import { VariantProps } from "class-variance-authority";

// ============================================================================
// Accordion Variants
// ============================================================================
export type AccordionVariantProps = VariantProps<typeof accordionVariants>;

// ============================================================================
// AlertDialogVariants
// ============================================================================
export type AlertDialogVariantProps = VariantProps<typeof alertDialogVariants>;

// ============================================================================
// Avatar Variants
// ============================================================================
export type AvatarVariantProps = VariantProps<typeof avatarVariants>;

// ============================================================================
// BadgeVariants
// ============================================================================
export type BadgeVariantProps = VariantProps<typeof badgeVariants>;

// ============================================================================
// Card Variants
// ============================================================================
export type CardVariantProps = VariantProps<typeof cardVariants>;

// ============================================================================
// ChipVariants
// ============================================================================
export type ChipVariantProps = VariantProps<typeof chipVariants>;

// ============================================================================
// ContainerVariants
// ============================================================================
export type ContainerVariantProps = VariantProps<typeof containerVariants>;

// ============================================================================
// ControlVariants
// ============================================================================
export type ControlVariantProps = VariantProps<typeof controlVariants>;

// ============================================================================
// DialogVariants
// ============================================================================
export type DialogContentVariantProps = VariantProps<
  typeof dialogContentVariants
>;
export type DialogLayoutVariantProps = VariantProps<
  typeof dialogLayoutVariants
>;

// ============================================================================
// Input Variants
// ============================================================================
export type InputVariantProps = VariantProps<typeof inputVariants>;

// ============================================================================
// Select Trigger Variants
// ============================================================================
export type SelectTriggerVariantProps = VariantProps<
  typeof selectTriggerVariants
>;
