import { PrismaClient, JobType, ApplicationStatus } from '@prisma/client';

const prisma = new PrismaClient();

const sampleApplications = [
  {
    companyName: 'InternSathi',
    jobTitle: 'Full Stack Intern',
    jobType: JobType.INTERNSHIP,
    status: ApplicationStatus.PENDING,
    appliedDate: new Date('2026-06-10T00:00:00.000Z'),
    notes: 'Submitted assignment. Waiting for screening call.',
  },
  {
    companyName: 'Google',
    jobTitle: 'Software Engineering Intern',
    jobType: JobType.INTERNSHIP,
    status: ApplicationStatus.SHORTLISTED,
    appliedDate: new Date('2026-05-28T00:00:00.000Z'),
    notes: 'Recruiter reached out on LinkedIn. Online assessment next.',
  },
  {
    companyName: 'Stripe',
    jobTitle: 'Backend Engineer',
    jobType: JobType.FULL_TIME,
    status: ApplicationStatus.INTERVIEWED,
    appliedDate: new Date('2026-05-15T00:00:00.000Z'),
    notes: 'Completed system design round. Final round scheduled.',
  },
  {
    companyName: 'Vercel',
    jobTitle: 'Frontend Engineer',
    jobType: JobType.FULL_TIME,
    status: ApplicationStatus.HIRED,
    appliedDate: new Date('2026-04-20T00:00:00.000Z'),
    notes: 'Offer accepted! Starting next quarter.',
  },
  {
    companyName: 'Meta',
    jobTitle: 'Product Engineer',
    jobType: JobType.FULL_TIME,
    status: ApplicationStatus.REJECTED,
    appliedDate: new Date('2026-04-05T00:00:00.000Z'),
    notes: 'Rejected after final round. Good feedback on coding.',
  },
  {
    companyName: 'Old Startup Inc',
    jobTitle: 'Junior Developer',
    jobType: JobType.PART_TIME,
    status: ApplicationStatus.AUTO_DELETE,
    appliedDate: new Date('2026-01-10T00:00:00.000Z'),
    notes: 'Stale posting, company no longer responsive.',
  },
  {
    companyName: 'Notion',
    jobTitle: 'Design Engineer Intern',
    jobType: JobType.INTERNSHIP,
    status: ApplicationStatus.PENDING,
    appliedDate: new Date('2026-06-15T00:00:00.000Z'),
    notes: 'Applied through referral.',
  },
  {
    companyName: 'Linear',
    jobTitle: 'Full Stack Engineer',
    jobType: JobType.FULL_TIME,
    status: ApplicationStatus.SHORTLISTED,
    appliedDate: new Date('2026-06-01T00:00:00.000Z'),
    notes: 'Phone screen booked for next week.',
  },
  {
    companyName: 'Figma',
    jobTitle: 'Platform Intern',
    jobType: JobType.INTERNSHIP,
    status: ApplicationStatus.INTERVIEWED,
    appliedDate: new Date('2026-05-22T00:00:00.000Z'),
    notes: 'Technical interview done, awaiting decision.',
  },
];

// The natural stage progression that leads to a given current status. Used to
// synthesize a believable stage history for seeded applications.
function stagePath(status: ApplicationStatus): ApplicationStatus[] {
  switch (status) {
    case ApplicationStatus.PENDING:
      return [ApplicationStatus.PENDING];
    case ApplicationStatus.SHORTLISTED:
      return [ApplicationStatus.PENDING, ApplicationStatus.SHORTLISTED];
    case ApplicationStatus.INTERVIEWED:
      return [
        ApplicationStatus.PENDING,
        ApplicationStatus.SHORTLISTED,
        ApplicationStatus.INTERVIEWED,
      ];
    case ApplicationStatus.HIRED:
      return [
        ApplicationStatus.PENDING,
        ApplicationStatus.SHORTLISTED,
        ApplicationStatus.INTERVIEWED,
        ApplicationStatus.HIRED,
      ];
    case ApplicationStatus.REJECTED:
      return [
        ApplicationStatus.PENDING,
        ApplicationStatus.SHORTLISTED,
        ApplicationStatus.INTERVIEWED,
        ApplicationStatus.REJECTED,
      ];
    case ApplicationStatus.AUTO_DELETE:
      return [ApplicationStatus.PENDING, ApplicationStatus.AUTO_DELETE];
    default:
      return [ApplicationStatus.PENDING];
  }
}

async function main() {
  console.log('🌱 Seeding database...');

  // Reset table to keep the seed idempotent. Stage logs cascade on delete.
  await prisma.application.deleteMany();

  for (const app of sampleApplications) {
    const path = stagePath(app.status);
    await prisma.application.create({
      data: {
        ...app,
        stageLogs: {
          create: path.map((status, i) => ({
            // First entry has no prior stage (creation); later entries record
            // the transition. Space each step a few days after the last.
            fromStatus: i === 0 ? null : path[i - 1],
            toStatus: status,
            changedAt: new Date(
              app.appliedDate.getTime() + i * 3 * 24 * 60 * 60 * 1000,
            ),
          })),
        },
      },
    });
  }

  const count = await prisma.application.count();
  console.log(`✅ Seeded ${count} job applications.`);
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
