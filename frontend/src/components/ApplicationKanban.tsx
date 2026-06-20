'use client';

import { useState } from 'react';
import {
  Application,
  ApplicationStatus,
  STATUS_LABELS,
  STATUS_ORDER,
} from '@/types/application';
import { ApplicationCard } from './ApplicationCard';

interface ApplicationKanbanProps {
  applications: Application[];
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onView: (application: Application) => void;
  onEdit: (application: Application) => void;
  onDelete: (application: Application) => void;
  updatingId?: string | null;
}

const COLUMN_ACCENT: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: 'bg-amber-400',
  [ApplicationStatus.SHORTLISTED]: 'bg-indigo-400',
  [ApplicationStatus.INTERVIEWED]: 'bg-orange-400',
  [ApplicationStatus.HIRED]: 'bg-emerald-400',
  [ApplicationStatus.REJECTED]: 'bg-red-400',
  [ApplicationStatus.AUTO_DELETE]: 'bg-gray-400',
};

export function ApplicationKanban({
  applications,
  onStatusChange,
  onView,
  onEdit,
  onDelete,
  updatingId,
}: ApplicationKanbanProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<ApplicationStatus | null>(
    null,
  );

  const grouped = STATUS_ORDER.reduce<Record<ApplicationStatus, Application[]>>(
    (acc, status) => {
      acc[status] = applications.filter((a) => a.status === status);
      return acc;
    },
    {
      [ApplicationStatus.PENDING]: [],
      [ApplicationStatus.SHORTLISTED]: [],
      [ApplicationStatus.INTERVIEWED]: [],
      [ApplicationStatus.HIRED]: [],
      [ApplicationStatus.REJECTED]: [],
      [ApplicationStatus.AUTO_DELETE]: [],
    },
  );

  const handleDrop = (status: ApplicationStatus) => {
    if (draggingId) {
      const dragged = applications.find((a) => a.id === draggingId);
      if (dragged && dragged.status !== status) {
        onStatusChange(draggingId, status);
      }
    }
    setDraggingId(null);
    setDragOverStatus(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STATUS_ORDER.map((status) => (
        <div
          key={status}
          onDragOver={(e) => {
            e.preventDefault();
            if (dragOverStatus !== status) setDragOverStatus(status);
          }}
          onDragLeave={(e) => {
            // Only clear when leaving the column entirely, not when moving
            // between child cards.
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setDragOverStatus((prev) => (prev === status ? null : prev));
            }
          }}
          onDrop={() => handleDrop(status)}
          className={`flex w-72 flex-shrink-0 flex-col rounded-xl border border-line/60 bg-sunken/70 transition-colors ${
            dragOverStatus === status
              ? 'border-primary/40 bg-primary-soft ring-2 ring-primary/30'
              : ''
          }`}
        >
          <div className="flex items-center justify-between gap-2 px-3 py-3">
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${COLUMN_ACCENT[status]}`}
              />
              <h3 className="text-sm font-semibold tracking-normal text-ink">
                {STATUS_LABELS[status]}
              </h3>
            </div>
            <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-ink-muted shadow-sm">
              {grouped[status].length}
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-2.5 px-2.5 pb-3">
            {grouped[status].length === 0 ? (
              <p className="px-1 py-6 text-center text-xs text-ink-muted/70">
                {dragOverStatus === status ? 'Drop here' : 'No applications'}
              </p>
            ) : (
              grouped[status].map((app) => (
                <div
                  key={app.id}
                  draggable
                  onDragStart={(e) => {
                    setDraggingId(app.id);
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragEnd={() => {
                    setDraggingId(null);
                    setDragOverStatus(null);
                  }}
                  className={`cursor-grab active:cursor-grabbing ${
                    draggingId === app.id ? 'opacity-50' : ''
                  }`}
                >
                  <ApplicationCard
                    application={app}
                    onStatusChange={onStatusChange}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    updating={updatingId === app.id}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
