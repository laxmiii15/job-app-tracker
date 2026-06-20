'use client';

import {
  ApplicationStatus,
  JobType,
  JOB_TYPE_LABELS,
  STATUS_LABELS,
  STATUS_ORDER,
} from '@/types/application';

export interface FilterState {
  search: string;
  status: ApplicationStatus | '';
  jobType: JobType | '';
}

interface ApplicationFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
}

export function ApplicationFilters({
  filters,
  onChange,
  onClear,
}: ApplicationFiltersProps) {
  const hasActiveFilters =
    filters.search !== '' || filters.status !== '' || filters.jobType !== '';

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
        <input
          type="text"
          className="input pl-9"
          placeholder="Search by company or job title…"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          aria-label="Search applications"
        />
      </div>

      <select
        className="input sm:w-44"
        value={filters.status}
        onChange={(e) =>
          onChange({
            ...filters,
            status: e.target.value as ApplicationStatus | '',
          })
        }
        aria-label="Filter by status"
      >
        <option value="">All statuses</option>
        {STATUS_ORDER.map((status) => (
          <option key={status} value={status}>
            {STATUS_LABELS[status]}
          </option>
        ))}
      </select>

      <select
        className="input sm:w-40"
        value={filters.jobType}
        onChange={(e) =>
          onChange({ ...filters, jobType: e.target.value as JobType | '' })
        }
        aria-label="Filter by job type"
      >
        <option value="">All job types</option>
        {Object.values(JobType).map((jobType) => (
          <option key={jobType} value={jobType}>
            {JOB_TYPE_LABELS[jobType]}
          </option>
        ))}
      </select>

      <button
        type="button"
        className="btn-secondary"
        onClick={onClear}
        disabled={!hasActiveFilters}
      >
        Clear filters
      </button>
    </div>
  );
}
