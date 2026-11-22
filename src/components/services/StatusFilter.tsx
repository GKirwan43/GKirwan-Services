import { SegmentedControl, type SegmentOption } from "@/components/ui/SegmentedControl";
import { STATUSES } from "@/constants/statuses";
import { cn } from "@/lib/cn";
import type { ServiceStatus } from "@/types/service";

type Option = ServiceStatus | "all";

const options: SegmentOption<Option>[] = [
  { value: "all", label: "All" },
  ...(Object.keys(STATUSES) as ServiceStatus[]).map((id) => ({
    value: id,
    label: STATUSES[id].label,
    icon: <i className={cn("size-4 rounded-full", STATUSES[id].dot)} />,
  })),
];

/** All / Running / Stopped / Unknown (as colored dots). Clicking the selected status again goes back to All. */
export function StatusFilter({
  value,
  onChange,
  fullWidth,
}: {
  value: ServiceStatus | null;
  onChange: (status: ServiceStatus | null) => void;
  /** Stretch the options to share the full width. */
  fullWidth?: boolean;
}) {
  return (
    <SegmentedControl
      label="Filter by status"
      options={options}
      value={value ?? "all"}
      onChange={(next) => onChange(next === "all" || next === value ? null : next)}
      fullWidth={fullWidth}
    />
  );
}
