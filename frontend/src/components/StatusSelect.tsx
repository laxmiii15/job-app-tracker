'use client';

import {
  ApplicationStatus,
  STATUS_LABELS,
  STATUS_ORDER,
} from '@/types/application';

interface StatusSelectProps {
  value: ApplicationStatus;
  onChange: (status: ApplicationStatus) => void;
  disabled?: boolean;
}

/** Compact inline dropdown to change an application's stage from a card or row. */
export function StatusSelect({ value, onChange, disabled }: StatusSelectProps) {
  return (
    <select
      className="rounded-md border border-line bg-surface px-2 py-1 text-xs font-medium text-ink shadow-sm transition-colors hover:border-ink-muted/40 focus:border-primary focus:ring-2 focus:ring-primary/25 disabled:opacity-60"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as ApplicationStatus)}
      onClick={(e) => e.stopPropagation()}
      aria-label="Change status"
    >
      {STATUS_ORDER.map((status) => (
        <option key={status} value={status}>
          {STATUS_LABELS[status]}
        </option>
      ))}
    </select>
  );
}
