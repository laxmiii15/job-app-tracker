import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ApplicationsService } from './applications.service';
import { ApplicationFilterInput } from './dto/application-filter.input';
import { CreateApplicationInput } from './dto/create-application.input';
import { PaginatedApplications } from './dto/paginated-applications.output';
import { UpdateApplicationInput } from './dto/update-application.input';
import { Application } from './entities/application.entity';
import { StageLog } from './entities/stage-log.entity';

@Resolver(() => Application)
export class ApplicationsResolver {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Query(() => PaginatedApplications, { name: 'applications' })
  applications(
    @Args('filter', { type: () => ApplicationFilterInput, nullable: true })
    filter?: ApplicationFilterInput,
  ): Promise<PaginatedApplications> {
    return this.applicationsService.findAll(filter);
  }

  @Query(() => Application, { name: 'application' })
  application(@Args('id') id: string): Promise<Application> {
    return this.applicationsService.findOne(id);
  }

  @Mutation(() => Application)
  createApplication(
    @Args('input') input: CreateApplicationInput,
  ): Promise<Application> {
    return this.applicationsService.create(input);
  }

  @Mutation(() => Application)
  updateApplication(
    @Args('id') id: string,
    @Args('input') input: UpdateApplicationInput,
  ): Promise<Application> {
    return this.applicationsService.update(id, input);
  }

  @Mutation(() => Boolean)
  deleteApplication(@Args('id') id: string): Promise<boolean> {
    return this.applicationsService.remove(id);
  }

  @ResolveField(() => [StageLog])
  stageLogs(@Parent() application: Application): Promise<StageLog[]> {
    return this.applicationsService.findStageLogs(application.id);
  }
}
