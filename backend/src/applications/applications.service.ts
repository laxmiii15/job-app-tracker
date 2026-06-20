import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ApplicationFilterInput } from './dto/application-filter.input';
import { CreateApplicationInput } from './dto/create-application.input';
import { PaginatedApplications } from './dto/paginated-applications.output';
import { UpdateApplicationInput } from './dto/update-application.input';
import { Application } from './entities/application.entity';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    filter?: ApplicationFilterInput,
  ): Promise<PaginatedApplications> {
    const page = filter?.page && filter.page > 0 ? filter.page : 1;
    const limit = filter?.limit && filter.limit > 0 ? filter.limit : 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ApplicationWhereInput = {};

    if (filter?.status) {
      where.status = filter.status;
    }

    if (filter?.jobType) {
      where.jobType = filter.jobType;
    }

    if (filter?.search) {
      const search = filter.search.trim();
      if (search.length > 0) {
        where.OR = [
          { companyName: { contains: search, mode: 'insensitive' } },
          { jobTitle: { contains: search, mode: 'insensitive' } },
        ];
      }
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.application.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.application.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async findOne(id: string): Promise<Application> {
    const application = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException(`Application with id "${id}" was not found.`);
    }

    return application;
  }

  async create(input: CreateApplicationInput): Promise<Application> {
    return this.prisma.application.create({
      data: {
        companyName: input.companyName,
        jobTitle: input.jobTitle,
        jobType: input.jobType,
        status: input.status,
        appliedDate: input.appliedDate,
        notes: input.notes ?? null,
        // Record the initial stage so the history starts from creation.
        stageLogs: {
          create: { toStatus: input.status ?? 'PENDING' },
        },
      },
    });
  }

  async update(
    id: string,
    input: UpdateApplicationInput,
  ): Promise<Application> {
    // Ensure the record exists first so we can throw a clean NotFoundException.
    const existing = await this.findOne(id);

    // Log the transition when the stage actually changes (current time).
    const statusChanged =
      input.status !== undefined && input.status !== existing.status;

    return this.prisma.application.update({
      where: { id },
      data: {
        companyName: input.companyName,
        jobTitle: input.jobTitle,
        jobType: input.jobType,
        status: input.status,
        appliedDate: input.appliedDate,
        notes: input.notes,
        ...(statusChanged
          ? {
              stageLogs: {
                create: {
                  fromStatus: existing.status,
                  toStatus: input.status!,
                },
              },
            }
          : {}),
      },
    });
  }

  findStageLogs(applicationId: string) {
    return this.prisma.stageLog.findMany({
      where: { applicationId },
      orderBy: { changedAt: 'asc' },
    });
  }

  async remove(id: string): Promise<boolean> {
    await this.findOne(id);
    await this.prisma.application.delete({ where: { id } });
    return true;
  }
}
