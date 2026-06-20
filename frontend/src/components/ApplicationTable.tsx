'use client';

import { Application, ApplicationStatus } from '@/types/application';
import { formatDate, truncate } from '@/lib/format';
import { JobTypeBadge } from './JobTypeBadge';
import { StatusBadge } from './StatusBadge';

interface ApplicationTableProps {
  applications: Application[];
  onView: (application: Application) => void;
  onEdit: (application: Application) => void;
  onDelete: (application: Application) => void;
}

export function ApplicationTable({
  applications,
  onView,
  onEdit,
  onDelete,
}: ApplicationTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-line text-sm">
        <thead className="bg-sunken/60 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
          <tr>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Job Title</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Applied</th>
            <th className="px-4 py-3">Notes</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line/70">
          {applications.map((app) => (
            <tr key={app.id} className="transition-colors hover:bg-sunken/40">
              <td className="px-4 py-3 font-medium text-ink">
                {app.companyName}
              </td>
              <td className="px-4 py-3 text-ink-muted">{app.jobTitle}</td>
              <td className="px-4 py-3">
                <JobTypeBadge jobType={app.jobType} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={app.status as ApplicationStatus} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-ink-muted">
                {formatDate(app.appliedDate)}
              </td>
              <td className="px-4 py-3 text-ink-muted">
                {app.notes ? truncate(app.notes, 40) : '—'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-ink-muted">
                {formatDate(app.createdAt)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    className="rounded-md px-2 py-1 text-xs font-medium text-ink-muted hover:bg-sunken"
                    title="View details"
                    onClick={() => onView(app)}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="rounded-md px-2 py-1 text-xs font-medium text-ink hover:bg-sunken"
                    title="Edit"
                    onClick={() => onEdit(app)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary-soft"
                    title="Delete"
                    onClick={() => onDelete(app)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
