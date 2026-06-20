'use client';

import { useEffect } from 'react';
import {
  Application,
  ApplicationStatus,
  STATUS_LABELS,
} from '@/types/application';
import { formatDate, formatDateTime } from '@/lib/format';
import { JobTypeBadge } from './JobTypeBadge';
import { StatusBadge } from './StatusBadge';

interface ApplicationDetailModalProps {
  application: Application | null;
  onEdit: (application: Application) => void;
  onDelete: (application: Application) => void;
  onClose: () => void;
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-line/70 py-3 sm:flex-row sm:items-center">
      <dt className="w-36 flex-shrink-0 text-sm font-medium text-ink-muted">
        {label}
      </dt>
      <dd className="text-sm text-ink">{children}</dd>
    </div>
  );
}

export function ApplicationDetailModal({
  application,
  onEdit,
  onDelete,
  onClose,
}: ApplicationDetailModalProps) {
  const open = application !== null;

  // Close on Escape for keyboard accessibility.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!application) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="my-8 w-full max-w-2xl rounded-xl border border-line bg-surface p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-ink">
              {application.companyName}
            </h2>
            <p className="mt-1 text-ink-muted">{application.jobTitle}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge status={application.status as ApplicationStatus} />
              <JobTypeBadge jobType={application.jobType} />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => onEdit(application)}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn-danger"
              onClick={() => onDelete(application)}
            >
              Delete
            </button>
          </div>
        </div>

        <dl className="mt-6">
          <DetailRow label="Applied Date">
            {formatDate(application.appliedDate)}
          </DetailRow>
          <DetailRow label="Notes">
            {application.notes ? (
              <span className="whitespace-pre-wrap">{application.notes}</span>
            ) : (
              <span className="text-ink-muted/60">No notes</span>
            )}
          </DetailRow>
          <DetailRow label="Created">
            {formatDateTime(application.createdAt)}
          </DetailRow>
          <DetailRow label="Last Updated">
            {formatDateTime(application.updatedAt)}
          </DetailRow>
        </dl>

        <div className="mt-6">
          <h3 className="text-base font-semibold text-ink">Stage History</h3>
          {application.stageLogs && application.stageLogs.length > 0 ? (
            <ol className="mt-3 space-y-3">
              {application.stageLogs.map((log) => (
                <li key={log.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary ring-4 ring-primary-soft" />
                    <span className="w-px flex-1 bg-line" />
                  </div>
                  <div className="-mt-0.5 pb-1">
                    <p className="text-sm text-ink">
                      {log.fromStatus ? (
                        <>
                          <span className="font-medium">
                            {STATUS_LABELS[log.fromStatus]}
                          </span>
                          <span className="text-ink-muted/60"> → </span>
                          <span className="font-medium">
                            {STATUS_LABELS[log.toStatus]}
                          </span>
                        </>
                      ) : (
                        <>
                          Created as{' '}
                          <span className="font-medium">
                            {STATUS_LABELS[log.toStatus]}
                          </span>
                        </>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-muted/70">
                      {formatDateTime(log.changedAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-2 text-sm text-ink-muted/70">
              No stage changes yet.
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
