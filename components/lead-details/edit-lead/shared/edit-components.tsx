import { Input } from "@/components/ui/forms/input";
import { Textarea } from "@/components/ui/forms/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/controls/select";
import { Separator } from "@/components/ui/layout/separator";
import { Container } from "@/components/ui/layout/containers";
import { hasAnyValue } from "@/components/lead-details/lib/helpers";
import type {
  EditRowProps,
  EditSection,
} from "@/components/lead-details/edit-lead/lib/types";
import { LeadFieldType } from "@/types/leads/fields";
import { StatusDropdown } from "@/components/field-controls/status";
import { PriorityDropdown } from "@/components/field-controls/priority";
import { LeadWithRelations } from "@/types";
import { CardTitle } from "@/components/ui/layout/card";
// ====================================================
// Constants
// ====================================================

const labelClassName = "capitalize text-xs font-normal text-subtle-foreground";
// ====================================================
// EditSection
// ====================================================

/**
 * Labeled section wrapper for the edit form.
 * Mirrors ConditionalInfoSection — renders nothing if all
 * items in the section have null values, otherwise renders
 * a Separator, heading, and a row per field.
 */
export function EditSectionBlock({
  section,
  label,
  items,
  formState,
  onChange,
}: EditSection & {
  formState: Record<string, string | null>;
  onChange: (key: string, value: string | null) => void;
}) {
  if (!hasAnyValue(items)) return null;

  return (
    <>
      <Separator />

      <Container spacing="block" as="section">
        <CardTitle className="text-sm @lg:text-base font-medium capitalize">
          {label}
        </CardTitle>
        <Container spacing="group">
          {items.map((item) => (
            <EditRow
              key={item.fieldKey}
              {...item}
              value={formState[item.fieldKey] ?? null}
              onChange={(value) => onChange(item.fieldKey, value)}
            />
          ))}
        </Container>
      </Container>
    </>
  );
}

// ====================================================
// EditSummaryBlock
// ====================================================

/**
 * Renders the status and priority controls at the top of the edit form.
 * These fields are DB columns managed outside the dynamic section form body,
 * so they're handled separately rather than flowing through buildEditSections.
 */
export function EditSummaryBlock({
  lead,
  onChange,
}: {
  lead: LeadWithRelations;
  onChange: (key: string, value: string | null) => void;
}) {
  return (
    <Container spacing="group" className="grid grid-cols-2">
      <EditSummaryField label="Status">
        <StatusDropdown
          intent="solid"
          currentStatus={lead.status}
          onStatusChange={(status) => onChange("status", status)}
          className="w-fit"
        />
      </EditSummaryField>
      <EditSummaryField label="Priority">
        <PriorityDropdown
          intent="soft"
          currentPriority={lead.priority}
          onPriorityChange={(priority) => onChange("priority", priority)}
          className="w-fit"
        />
      </EditSummaryField>
    </Container>
  );
}

// ====================================================
// EditSummaryField
// ====================================================

/**
 * Label wrapper for a summary control.
 * Uses children instead of a dropdown prop so it isn't
 * coupled to a specific dropdown component.
 */
function EditSummaryField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Container spacing="item">
      <span className={labelClassName}>{label}</span>
      {children}
    </Container>
  );
}

// ====================================================
// EditRow
// ====================================================

/**
 * Single label/input row in the edit form.
 * Delegates input rendering to EditInput based on fieldType.
 * Never renders null — empty fields render as empty inputs
 * so the user can fill them in.
 */
export function EditRow({
  label,
  fieldKey,
  fieldType,
  value,
  options,
  onChange,
}: EditRowProps & {
  onChange: (value: string | null) => void;
}) {
  return (
    <Container spacing="item">
      <label htmlFor={fieldKey} className={labelClassName}>
        {label}
      </label>
      <EditInput
        // id={fieldKey}
        fieldType={fieldType}
        value={value}
        options={options}
        onChange={onChange}
      />
    </Container>
  );
}

// ====================================================
// EditInput
// ====================================================

/**
 * Renders the correct input variant for a given fieldType.
 * Consults options for select fields — SELECT_FIELD_OPTIONS
 * takes priority over registry options, resolved upstream
 * in buildEditSections before reaching this component.
 */
const INPUT_RENDERERS: Record<
  LeadFieldType,
  (props: InputRendererProps) => React.ReactElement
> = {
  textarea: ({ value, onChange }) => (
    <Textarea
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      className="text-sm"
    />
  ),
  select: ({ value, options, onChange }) => (
    <Select value={value ?? ""} onValueChange={(val) => onChange(val || null)}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options?.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
  email: ({ value, onChange }) => (
    <Input
      type="email"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      className="text-sm"
    />
  ),
  phone: ({ value, onChange }) => (
    <Input
      type="tel"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      className="text-sm"
    />
  ),
  url: ({ value, onChange }) => (
    <Input
      type="url"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      className="text-sm"
    />
  ),
  text: ({ value, onChange }) => (
    <Input
      type="text"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      className="text-sm"
    />
  ),
};

interface InputRendererProps {
  value: string | null;
  options?: readonly string[];
  onChange: (value: string | null) => void;
}

export function EditInput({
  fieldType,
  value,
  options,
  onChange,
}: {
  fieldType: LeadFieldType;
  value: string | null;
  options?: readonly string[];
  onChange: (value: string | null) => void;
}) {
  const renderer = INPUT_RENDERERS[fieldType] ?? INPUT_RENDERERS.text;
  return renderer({ value, options, onChange });
}
