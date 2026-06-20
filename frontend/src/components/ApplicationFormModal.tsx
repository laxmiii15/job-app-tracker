'use client';

import { useEffect } from 'react';
import { Application, CreateApplicationInput } from '@/types/application';
import { ApplicationForm } from './ApplicationForm';

interface ApplicationFormModalProps {
  open: boolean;
  initial?: Application;
  title: string;
  description?: string;
  submitLabel: string;
  submitting?: boolean;
  onSubmit: (values: CreateApplicationInput) => void;
  onClose: () => void;
}

export function ApplicationFormModal({
  open,
  initial,
  title,
  description,
  submitLabel,
  submitting,
  onSubmit,
  onClose,
}: ApplicationFormModalProps) {
  // Close on Escape for keyboard accessibility.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !submitting) onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, submitting, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      onClick={() => !submitting && onClose()}
    >
      <div
        className="my-8 w-full max-w-3xl rounded-xl border border-line bg-surface p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-ink">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-ink-muted">{description}</p>
          )}
        </div>
        <ApplicationForm
          initial={initial}
          submitLabel={submitLabel}
          submitting={submitting}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
