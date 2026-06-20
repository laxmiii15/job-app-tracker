import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Application } from '../entities/application.entity';

@ObjectType()
export class PaginationMeta {
  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  totalPages!: number;
}

@ObjectType()
export class PaginatedApplications {
  @Field(() => [Application])
  data!: Application[];

  @Field(() => PaginationMeta)
  meta!: PaginationMeta;
}
