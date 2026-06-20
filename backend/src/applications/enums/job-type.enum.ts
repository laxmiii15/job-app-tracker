import { registerEnumType } from '@nestjs/graphql';
import { JobType } from '@prisma/client';

// Re-export the Prisma-generated enum so the rest of the app has a single source.
export { JobType };

registerEnumType(JobType, {
  name: 'JobType',
  description: 'The employment type for a job application.',
});
