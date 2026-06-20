import { registerEnumType } from '@nestjs/graphql';
import { ApplicationStatus } from '@prisma/client';

// Re-export the Prisma-generated enum so the rest of the app has a single source.
export { ApplicationStatus };

registerEnumType(ApplicationStatus, {
  name: 'ApplicationStatus',
  description: 'The stage of a job application in the hiring pipeline.',
});
