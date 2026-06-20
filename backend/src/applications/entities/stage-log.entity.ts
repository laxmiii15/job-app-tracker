import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ApplicationStatus } from '../enums/application-status.enum';

@ObjectType()
export class StageLog {
  @Field(() => ID)
  id!: string;

  @Field(() => ApplicationStatus, { nullable: true })
  fromStatus?: ApplicationStatus | null;

  @Field(() => ApplicationStatus)
  toStatus!: ApplicationStatus;

  @Field()
  changedAt!: Date;
}
