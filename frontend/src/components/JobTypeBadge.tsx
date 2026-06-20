import { JobType, JOB_TYPE_LABELS } from '@/types/application';

const JOB_TYPE_STYLES: Record<JobType, string> = {
  [JobType.INTERNSHIP]: 'bg-sky-50 text-sky-700 ring-sky-200',
  [JobType.FULL_TIME]: 'bg-violet-50 text-violet-700 ring-violet-200',
  [JobType.PART_TIME]: 'bg-teal-50 text-teal-700 ring-teal-200',
};

export function JobTypeBadge({ jobType }: { jobType: JobType }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${JOB_TYPE_STYLES[jobType]}`}
    >
      {JOB_TYPE_LABELS[jobType]}
    </span>
  );
}
