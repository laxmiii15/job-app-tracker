'use client';

import { useState } from 'react';
import {
  Application,
  ApplicationStatus,
  CreateApplicationInput,
  JobType,
  JOB_TYPE_LABELS,
  STATUS_LABELS,
  STATUS_ORDER,
} from '@/types/application';
import { toDateInputValue } from '@/lib/format';

interface ApplicationFormProps {
  initial?: Application;
  submitLabel: string;
  submitting?: boolean;
  onSubmit: (values: CreateApplicationInput) => void;
  onCancel: () => void;
}

interface FormErrors {
  companyName?: string;
  jobTitle?: string;
  appliedDate?: string;
}

export function ApplicationForm({
  initial,
  submitLabel,
  submitting,
  onSubmit,
  onCancel,
}: ApplicationFormProps) {
  const [companyName, setCompanyName] = useState(initial?.companyName ?? '');
  const [jobTitle, setJobTitle] = useState(initial?.jobTitle ?? '');
  const [jobType, setJobType] = useState<JobType>(
    initial?.jobType ?? JobType.INTERNSHIP,
  );
  const [status, setStatus] = useState<ApplicationStatus>(
    initial?.status ?? ApplicationStatus.PENDING,
  );
  const [appliedDate, setAppliedDate] = useState(
    toDateInputValue(initial?.appliedDate) ||
      toDateInputValue(new Date().toISOString()),
  );
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (companyName.trim().length < 2) {
      next.companyName = 'Company name must be at least 2 characters.';
    }
    if (jobTitle.trim().length === 0) {
      next.jobTitle = 'Job title is required.';
    }
    if (!appliedDate) {
      next.appliedDate = 'Applied date is required.';
    }
    return next;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit({
      companyName: companyName.trim(),
      jobTitle: jobTitle.trim(),
      jobType,
      status,
      // Send a full ISO timestamp so the backend DateTime parses cleanly.
      appliedDate: new Date(`${appliedDate}T00:00:00.000Z`).toISOString(),
      notes: notes.trim() ? notes.trim() : null,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="companyName">
            Company Name <span className="text-primary">*</span>
          </label>
          <input
            id="companyName"
            className="input"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. InternSathi"
          />
          {errors.companyName && (
            <p className="mt-1 text-xs text-primary">{errors.companyName}</p>
          )}
        </div>

        <div>
          <label className="label" htmlFor="jobTitle">
            Job Title <span className="text-primary">*</span>
          </label>
          <input
            id="jobTitle"
            className="input"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Full Stack Intern"
          />
          {errors.jobTitle && (
            <p className="mt-1 text-xs text-primary">{errors.jobTitle}</p>
          )}
        </div>

        <div>
          <label className="label" htmlFor="jobType">
            Job Type
          </label>
          <select
            id="jobType"
            className="input"
            value={jobType}
            onChange={(e) => setJobType(e.target.value as JobType)}
          >
            {Object.values(JobType).map((type) => (
              <option key={type} value={type}>
                {JOB_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="status">
            Stage / Status
          </label>
          <select
            id="status"
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
          >
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="appliedDate">
            Applied Date <span className="text-primary">*</span>
          </label>
          <input
            id="appliedDate"
            type="date"
            className="input"
            value={appliedDate}
            onChange={(e) => setAppliedDate(e.target.value)}
          />
          {errors.appliedDate && (
            <p className="mt-1 text-xs text-primary">{errors.appliedDate}</p>
          )}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="notes">
          Notes <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          id="notes"
          className="input min-h-[96px] resize-y"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any extra context about this application…"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
