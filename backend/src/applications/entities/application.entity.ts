import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ApplicationStatus } from '../enums/application-status.enum';
import { JobType } from '../enums/job-type.enum';
import { StageLog } from './stage-log.entity';

@ObjectType()
export class Application {
  @Field(() => ID)
  id!: string;

  @Field()
  companyName!: string;

  @Field()
  jobTitle!: string;

  @Field(() => JobType)
  jobType!: JobType;

  @Field(() => ApplicationStatus)
  status!: ApplicationStatus;

  @Field()
  appliedDate!: Date;

  @Field(() => String, { nullable: true })
  notes?: string | null;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field(() => [StageLog])
  stageLogs?: StageLog[];
}
