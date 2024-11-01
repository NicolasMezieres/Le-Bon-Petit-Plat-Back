import { Test, TestingModule } from '@nestjs/testing';
import { CommentaryService } from './commentary.service';
import { Model, set } from 'mongoose';
import { Commentary, CommentarySchema } from 'src/schemas/commentary.schema';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { CommentaryController } from './commentary.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentaryPrismaMock } from './mocks/commentary.prisma.mock';
import { CommentaryModelMock } from './mocks/commentary.model.mock';
import { CommentaryMocks } from './mocks/commentary.mock';
import { NotFoundException } from '@nestjs/common';
describe('CommentaryService', () => {
  let service: CommentaryService;
  let prisma: PrismaService;
  const dto = {
    idRecipe: '923c3dca-42eb-41b7-9720-67b35a5db759',
    note: 2,
    text: 'test',
  };
  const user = {
    id: '923c3dca-42eb-41b7-9720-67b35a5db759',
    isActive: true,
    email: 'test@gmail.com',
    username: 'test',
    role: 'User',
    idRole: '923c3dca-42eb-41b7-9720-67b35a5db759',
    firstName: 'test',
    lastName: 'test',
    password: 'Alpin@73',
    token: '',
    favoriteRecipe: [],
    createdAt: new Date(),
    gdpr: new Date(),
    updatedAt: new Date(),
  };
  const userJWT = {
    id: '923c3dca-42eb-41b7-9720-67b35a5db759',
    isActive: true,
    email: 'test@gmail.com',
    role: {
      id: '923c3dca-42eb-41b7-9720-67b35a5db759',
      name: 'User',
    },
  };
  const id = '1';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentaryService,
        { provide: PrismaService, useValue: CommentaryPrismaMock },
        { provide: getModelToken('Commentary'), useValue: CommentaryModelMock },
      ],
    }).compile();
    service = module.get<CommentaryService>(CommentaryService);
    prisma = module.get<PrismaService>(PrismaService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('create commentary', () => {
      jest
        .spyOn(CommentaryPrismaMock.recipe, 'findUnique')
        .mockResolvedValue(new NotFoundException());
      jest
        .spyOn(CommentaryModelMock.commentaryModel, 'find')
        .mockResolvedValue({ exec: jest.fn().mockResolvedValue(undefined) });
      expect(service.create(dto, user)).resolves.toEqual({
        data: 'Commentary created',
      });
    });
  });
  describe('findAllByRecipe', () => {
    it('find all recipe', () => {
      expect(service.findAllByRecipe(id)).toBeDefined;
    });
  });
});
