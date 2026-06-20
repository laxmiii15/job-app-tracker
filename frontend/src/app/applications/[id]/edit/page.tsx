'use client';

import { useMutation, useQuery } from '@apollo/client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AppHeader } from '@/components/AppHeader';
import { ApplicationForm } from '@/components/ApplicationForm';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { UPDATE_APPLICATION } from '@/lib/graphql/mutations';
import { GET_APPLICATION } from '@/lib/graphql/queries';
import { Application, CreateApplicationInput } from '@/types/application';

export default function EditApplicationPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, loading, error } = useQuery<{ application: Application }>(
    GET_APPLICATION,
    { variables: { id } },
  );

  const [updateApplication, { loading: saving }] =
    useMutation(UPDATE_APPLICATION);

  async function handleSubmit(values: CreateApplicationInput) {
    try {
      await updateApplication({ variables: { id, input: values } });
      toast.success('Application updated');
      router.push(`/applications/${id}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to update application',
      );
    }
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href={`/applications/${id}`}
          className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
        >
          ← Back to details
        </Link>

        {loading ? (
          <LoadingState />
        ) : error || !data?.application ? (
          <EmptyState
            title="Application not found"
            description="It may have been deleted or the link is invalid."
            actionLabel="Back to applications"
            actionHref="/applications"
            icon="🚫"
          />
        ) : (
          <div className="card p-6 sm:p-8">
            <h1 className="mb-1 text-xl font-bold text-gray-900">
              Edit Application
            </h1>
            <p className="mb-6 text-sm text-gray-500">
              Update the details for this application.
            </p>
            <ApplicationForm
              initial={data.application}
              submitLabel="Save Changes"
              submitting={saving}
              onSubmit={handleSubmit}
              onCancel={() => router.push(`/applications/${id}`)}
            />
          </div>
        )}
      </main>
    </div>
  );
}
