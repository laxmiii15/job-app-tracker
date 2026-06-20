'use client';

import { useMutation, useQuery } from '@apollo/client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { AppHeader } from '@/components/AppHeader';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { EmptyState } from '@/components/EmptyState';
import { JobTypeBadge } from '@/components/JobTypeBadge';
import { LoadingState } from '@/components/LoadingState';
import { StatusBadge } from '@/components/StatusBadge';
import { DELETE_APPLICATION } from '@/lib/graphql/mutations';
import { GET_APPLICATION } from '@/lib/graphql/queries';
import { formatDate, formatDateTime } from '@/lib/format';
import { Application, ApplicationStatus } from '@/types/application';

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-gray-100 py-3 sm:flex-row sm:items-center">
      <dt className="w-40 flex-shrink-0 text-sm font-medium text-gray-500">
        {label}
      </dt>
      <dd className="text-sm text-gray-900">{children}</dd>
    </div>
  );
}

export default function ApplicationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data, loading, error } = useQuery<{ application: Application }>(
    GET_APPLICATION,
    { variables: { id } },
  );

  const [deleteApplication, { loading: deleting }] = useMutation(
    DELETE_APPLICATION,
    { refetchQueries: ['Applications'] },
  );

  async function handleDelete() {
    try {
      await deleteApplication({ variables: { id } });
      toast.success('Application deleted');
      router.push('/applications');
    } catch {
      toast.error('Failed to delete application');
    }
  }

  const app = data?.application;

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/applications"
          className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
        >
          ← Back to applications
        </Link>

        {loading ? (
          <LoadingState />
        ) : error || !app ? (
          <EmptyState
            title="Application not found"
            description="It may have been deleted or the link is invalid."
            actionLabel="Back to applications"
            actionHref="/applications"
            icon="🚫"
          />
        ) : (
          <div className="card p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {app.companyName}
                </h1>
                <p className="mt-1 text-gray-600">{app.jobTitle}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StatusBadge status={app.status as ApplicationStatus} />
                  <JobTypeBadge jobType={app.jobType} />
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/applications/${app.id}/edit`}
                  className="btn-secondary"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => setConfirmOpen(true)}
                >
                  Delete
                </button>
              </div>
            </div>

            <dl className="mt-6">
              <DetailRow label="Applied Date">
                {formatDate(app.appliedDate)}
              </DetailRow>
              <DetailRow label="Notes">
                {app.notes ? (
                  <span className="whitespace-pre-wrap">{app.notes}</span>
                ) : (
                  <span className="text-gray-400">No notes</span>
                )}
              </DetailRow>
              <DetailRow label="Created">
                {formatDateTime(app.createdAt)}
              </DetailRow>
              <DetailRow label="Last Updated">
                {formatDateTime(app.updatedAt)}
              </DetailRow>
            </dl>
          </div>
        )}
      </main>

      <DeleteConfirmDialog
        open={confirmOpen}
        loading={deleting}
        description={
          app
            ? `Delete the application for "${app.jobTitle}" at ${app.companyName}? This cannot be undone.`
            : undefined
        }
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
