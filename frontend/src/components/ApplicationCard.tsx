'use client';

import { Application, ApplicationStatus } from '@/types/application';
import { formatDate } from '@/lib/format';
import { JobTypeBadge } from './JobTypeBadge';
import { StatusSelect } from './StatusSelect';

interface ApplicationCardProps {
  application: Application;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onView: (application: Application) => void;
  onEdit: (application: Application) => void;
  onDelete: (application: Application) => void;
  updating?: boolean;
}

export function ApplicationCard({
  application,
  onStatusChange,
  onView,
  onEdit,
  onDelete,
  updating,
}: ApplicationCardProps) {
  return (
    <div className="group rounded-lg border border-line bg-surface p-3.5 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          className="text-left font-serif text-[15px] font-medium text-ink hover:text-primary"
          onClick={() => onView(application)}
        >
          {application.companyName}
        </button>
        <JobTypeBadge jobType={application.jobType} />
      </div>

      <p className="mt-0.5 text-sm text-ink-muted">{application.jobTitle}</p>

      <p className="mt-2 text-xs text-ink-muted/70">
        Applied {formatDate(application.appliedDate)}
      </p>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-line/70 pt-3">
        <StatusSelect
          value={application.status as ApplicationStatus}
          disabled={updating}
          onChange={(status) => onStatusChange(application.id, status)}
        />
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded-md px-2 py-1 text-xs font-medium text-ink hover:bg-sunken"
            onClick={() => onEdit(application)}
          >
            Edit
          </button>
          <button
            type="button"
            className="rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary-soft"
            onClick={() => onDelete(application)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
