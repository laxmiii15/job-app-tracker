import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationStatus, JobType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ApplicationsService } from './applications.service';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let prisma: {
    application: {
      findMany: jest.Mock;
      count: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  const sample = {
    id: '11111111-1111-1111-1111-111111111111',
    companyName: 'InternSathi',
    jobTitle: 'Full Stack Intern',
    jobType: JobType.INTERNSHIP,
    status: ApplicationStatus.PENDING,
    appliedDate: new Date('2026-06-19T00:00:00.000Z'),
    notes: 'Submitted assignment.',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      application: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('returns paginated data with correct meta', async () => {
      prisma.$transaction.mockResolvedValue([[sample], 1]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('findOne', () => {
    it('returns an application when found', async () => {
      prisma.application.findUnique.mockResolvedValue(sample);

      await expect(service.findOne(sample.id)).resolves.toEqual(sample);
    });

    it('throws NotFoundException when missing', async () => {
      prisma.application.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing-id')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('deletes and returns true when the record exists', async () => {
      prisma.application.findUnique.mockResolvedValue(sample);
      prisma.application.delete.mockResolvedValue(sample);

      await expect(service.remove(sample.id)).resolves.toBe(true);
      expect(prisma.application.delete).toHaveBeenCalledWith({
        where: { id: sample.id },
      });
    });
  });
});
