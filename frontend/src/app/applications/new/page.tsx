'use client';

import { useMutation } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AppHeader } from '@/components/AppHeader';
import { ApplicationForm } from '@/components/ApplicationForm';
import { CREATE_APPLICATION } from '@/lib/graphql/mutations';
import { GET_APPLICATIONS } from '@/lib/graphql/queries';
import { CreateApplicationInput } from '@/types/application';

export default function NewApplicationPage() {
  const router = useRouter();
  const [createApplication, { loading }] = useMutation(CREATE_APPLICATION, {
    refetchQueries: [GET_APPLICATIONS],
  });

  async function handleSubmit(values: CreateApplicationInput) {
    try {
      await createApplication({ variables: { input: values } });
      toast.success('Application created');
      router.push('/applications');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to create application',
      );
    }
  }

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
        <div className="card p-6 sm:p-8">
          <h1 className="mb-1 text-xl font-bold text-gray-900">
            Add Application
          </h1>
          <p className="mb-6 text-sm text-gray-500">
            Log a new job application to track its progress.
          </p>
          <ApplicationForm
            submitLabel="Create Application"
            submitting={loading}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/applications')}
          />
        </div>
      </main>
    </div>
  );
}
