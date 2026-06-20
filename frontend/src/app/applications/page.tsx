'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import toast from 'react-hot-toast';
import { AppHeader } from '@/components/AppHeader';
import { ApplicationFilters, FilterState } from '@/components/ApplicationFilters';
import { ApplicationDetailModal } from '@/components/ApplicationDetailModal';
import { ApplicationFormModal } from '@/components/ApplicationFormModal';
import { ApplicationKanban } from '@/components/ApplicationKanban';
import { ApplicationTable } from '@/components/ApplicationTable';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { EmptyState } from '@/components/EmptyState';
import { TableSkeleton, LoadingState } from '@/components/LoadingState';
import { Pagination } from '@/components/Pagination';
import {
  DELETE_APPLICATION,
  UPDATE_APPLICATION,
} from '@/lib/graphql/mutations';
import { GET_APPLICATIONS } from '@/lib/graphql/queries';
import {
  Application,
  ApplicationStatus,
  CreateApplicationInput,
  PaginatedApplications,
} from '@/types/application';

type ViewMode = 'table' | 'kanban';

const PAGE_LIMIT = 10;
const KANBAN_LIMIT = 100;

export default function ApplicationsPage() {
  const [view, setView] = useState<ViewMode>('table');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: '',
    jobType: '',
  });
  const [pendingDelete, setPendingDelete] = useState<Application | null>(null);
  const [pendingEdit, setPendingEdit] = useState<Application | null>(null);
  const [pendingView, setPendingView] = useState<Application | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const variables = useMemo(
    () => ({
      filter: {
        search: filters.search.trim() || undefined,
        status: filters.status || undefined,
        jobType: filters.jobType || undefined,
        page: view === 'table' ? page : 1,
        limit: view === 'table' ? PAGE_LIMIT : KANBAN_LIMIT,
      },
    }),
    [filters, page, view],
  );

  const { data, loading, error, refetch } = useQuery<{
    applications: PaginatedApplications;
  }>(GET_APPLICATIONS, { variables });

  const [updateApplication, { loading: savingEdit }] =
    useMutation(UPDATE_APPLICATION);
  const [deleteApplication, { loading: deleting }] =
    useMutation(DELETE_APPLICATION);

  const applications = data?.applications.data ?? [];
  const meta = data?.applications.meta;

  function handleFilterChange(next: FilterState) {
    setFilters(next);
    setPage(1);
  }

  function handleClearFilters() {
    setFilters({ search: '', status: '', jobType: '' });
    setPage(1);
  }

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    setUpdatingId(id);
    try {
      // Optimistic UI: Apollo updates the normalized cache entry immediately.
      await updateApplication({
        variables: { id, input: { status } },
        optimisticResponse: {
          updateApplication: {
            __typename: 'Application',
            ...applications.find((a) => a.id === id),
            id,
            status,
          },
        },
      });
      toast.success('Status updated');
      // Refetch so status filters / counts stay accurate.
      await refetch();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    try {
      await deleteApplication({ variables: { id: pendingDelete.id } });
      toast.success('Application deleted');
      setPendingDelete(null);
      await refetch();
    } catch {
      toast.error('Failed to delete application');
    }
  }

  async function handleEditSubmit(values: CreateApplicationInput) {
    if (!pendingEdit) return;
    try {
      await updateApplication({
        variables: { id: pendingEdit.id, input: values },
      });
      toast.success('Application updated');
      setPendingEdit(null);
      await refetch();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to update application',
      );
    }
  }

  const hasActiveFilters =
    filters.search !== '' || filters.status !== '' || filters.jobType !== '';

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-ink">
              Applications
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              Track every job application across stages.
            </p>
          </div>

          {/* Segmented control: Table / Kanban */}
          <div className="inline-flex rounded-lg border border-line bg-surface p-1 shadow-sm">
            {(['table', 'kanban'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setView(mode)}
                className={`rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                  view === mode
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="card mb-6 p-4">
          <ApplicationFilters
            filters={filters}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
          />
        </div>

        {error ? (
          <div className="card flex flex-col items-center gap-3 p-10 text-center">
            <span className="text-3xl">⚠️</span>
            <p className="font-medium text-ink">Something went wrong</p>
            <p className="text-sm text-ink-muted">{error.message}</p>
            <button
              type="button"
              className="btn-primary mt-2"
              onClick={() => refetch()}
            >
              Retry
            </button>
          </div>
        ) : loading && applications.length === 0 ? (
          view === 'table' ? (
            <div className="card overflow-hidden">
              <TableSkeleton />
            </div>
          ) : (
            <LoadingState label="Loading board…" />
          )
        ) : applications.length === 0 ? (
          <EmptyState
            title={
              hasActiveFilters
                ? 'No matching applications'
                : 'No applications yet'
            }
            description={
              hasActiveFilters
                ? 'Try adjusting your search or filters.'
                : 'Get started by adding your first job application.'
            }
            actionLabel={hasActiveFilters ? undefined : 'Add Application'}
            actionHref={hasActiveFilters ? undefined : '/applications/new'}
            icon={hasActiveFilters ? '🔍' : '📭'}
          />
        ) : view === 'table' ? (
          <div className="card overflow-hidden">
            <ApplicationTable
              applications={applications}
              onView={setPendingView}
              onEdit={setPendingEdit}
              onDelete={setPendingDelete}
            />
            {meta && <Pagination meta={meta} onPageChange={setPage} />}
          </div>
        ) : (
          <ApplicationKanban
            applications={applications}
            onStatusChange={handleStatusChange}
            onView={setPendingView}
            onEdit={setPendingEdit}
            onDelete={setPendingDelete}
            updatingId={updatingId}
          />
        )}
      </main>

      <ApplicationDetailModal
        application={pendingView}
        onEdit={(app) => {
          setPendingView(null);
          setPendingEdit(app);
        }}
        onDelete={(app) => {
          setPendingView(null);
          setPendingDelete(app);
        }}
        onClose={() => setPendingView(null)}
      />

      <ApplicationFormModal
        open={pendingEdit !== null}
        initial={pendingEdit ?? undefined}
        title="Edit Application"
        description="Update the details for this application."
        submitLabel="Save Changes"
        submitting={savingEdit}
        onSubmit={handleEditSubmit}
        onClose={() => setPendingEdit(null)}
      />

      <DeleteConfirmDialog
        open={pendingDelete !== null}
        loading={deleting}
        description={
          pendingDelete
            ? `Delete the application for "${pendingDelete.jobTitle}" at ${pendingDelete.companyName}? This cannot be undone.`
            : undefined
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
