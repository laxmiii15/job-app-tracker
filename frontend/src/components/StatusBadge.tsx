import { ApplicationStatus, STATUS_LABELS } from '@/types/application';

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: 'bg-amber-100 text-amber-800 ring-amber-200',
  [ApplicationStatus.SHORTLISTED]:
    'bg-indigo-100 text-indigo-800 ring-indigo-200',
  [ApplicationStatus.INTERVIEWED]:
    'bg-orange-100 text-orange-800 ring-orange-200',
  [ApplicationStatus.HIRED]:
    'bg-emerald-100 text-emerald-800 ring-emerald-200',
  [ApplicationStatus.REJECTED]: 'bg-red-100 text-red-800 ring-red-200',
  [ApplicationStatus.AUTO_DELETE]: 'bg-gray-200 text-gray-700 ring-gray-300',
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
