import { Checkbox } from "@/components/ui/checkbox";

export function VerifyCheckbox({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2 rounded-md border bg-background p-3 text-sm">
      <Checkbox
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(Boolean(v))}
        className="mt-0.5"
      />
      <span className="leading-snug">
        I have reviewed and verified this AI-generated output.
      </span>
    </label>
  );
}