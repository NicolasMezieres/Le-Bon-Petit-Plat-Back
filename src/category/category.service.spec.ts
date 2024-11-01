import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaServiceMock } from './mocks/category.prisma.mock';
import { categoryMock } from './mocks/category.mock';
import { Category } from '@prisma/client';

describe('CategoryService', () => {
  let service: CategoryService;
  let prisma: PrismaService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: PrismaService, useValue: PrismaServiceMock },
      ],
    }).compile();
    service = module.get<CategoryService>(CategoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('find all category', () => {
    it('all category', () => {
      expect(PrismaServiceMock).resolves.toEqual(categoryMock);
    });
  });
});
