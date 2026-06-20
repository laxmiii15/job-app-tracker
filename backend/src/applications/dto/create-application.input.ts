import { Field, InputType } from '@nestjs/graphql';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApplicationStatus } from '../enums/application-status.enum';
import { JobType } from '../enums/job-type.enum';

@InputType()
export class CreateApplicationInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Company name is required.' })
  @MinLength(2, { message: 'Company name must be at least 2 characters.' })
  @MaxLength(120)
  companyName!: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Job title is required.' })
  @MaxLength(120)
  jobTitle!: string;

  @Field(() => JobType)
  @IsEnum(JobType, { message: 'Invalid job type.' })
  jobType!: JobType;

  // No GraphQL defaultValue here: the Prisma column defaults to PENDING on
  // create, and a default would be inherited by UpdateApplicationInput
  // (via PartialType), silently resetting status on every partial update.
  @Field(() => ApplicationStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ApplicationStatus, { message: 'Invalid status.' })
  status?: ApplicationStatus;

  @Field()
  @IsDate({ message: 'Applied date must be a valid date.' })
  appliedDate!: Date;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
