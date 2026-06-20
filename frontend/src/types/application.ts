export enum JobType {
  INTERNSHIP = 'INTERNSHIP',
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  SHORTLISTED = 'SHORTLISTED',
  INTERVIEWED = 'INTERVIEWED',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED',
  AUTO_DELETE = 'AUTO_DELETE',
}

export interface StageLog {
  id: string;
  fromStatus?: ApplicationStatus | null;
  toStatus: ApplicationStatus;
  changedAt: string;
}

export interface Application {
  id: string;
  companyName: string;
  jobTitle: string;
  jobType: JobType;
  status: ApplicationStatus;
  appliedDate: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  stageLogs?: StageLog[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedApplications {
  data: Application[];
  meta: PaginationMeta;
}

export interface ApplicationFilterInput {
  status?: ApplicationStatus | null;
  jobType?: JobType | null;
  search?: string | null;
  page?: number;
  limit?: number;
}

export interface CreateApplicationInput {
  companyName: string;
  jobTitle: string;
  jobType: JobType;
  status?: ApplicationStatus;
  appliedDate: string;
  notes?: string | null;
}

export type UpdateApplicationInput = Partial<CreateApplicationInput>;

// Display order + human labels used across table and kanban views.
export const STATUS_ORDER: ApplicationStatus[] = [
  ApplicationStatus.PENDING,
  ApplicationStatus.SHORTLISTED,
  ApplicationStatus.INTERVIEWED,
  ApplicationStatus.HIRED,
  ApplicationStatus.REJECTED,
  ApplicationStatus.AUTO_DELETE,
];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: 'Pending',
  [ApplicationStatus.SHORTLISTED]: 'Shortlisted',
  [ApplicationStatus.INTERVIEWED]: 'Interviewed',
  [ApplicationStatus.HIRED]: 'Hired',
  [ApplicationStatus.REJECTED]: 'Rejected',
  [ApplicationStatus.AUTO_DELETE]: 'Auto Delete',
};

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  [JobType.INTERNSHIP]: 'Internship',
  [JobType.FULL_TIME]: 'Full-time',
  [JobType.PART_TIME]: 'Part-time',
};
