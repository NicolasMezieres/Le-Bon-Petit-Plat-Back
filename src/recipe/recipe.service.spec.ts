import { Test, TestingModule } from '@nestjs/testing';
import { RecipeService } from './recipe.service';
import { ingredient } from './dto';
import { recipeMocks } from './mocks/recipe.mocks';
import { PrismaService } from 'src/prisma/prisma.service';
import { RecipeServiceMock } from './mocks/recipe.service.mock';

describe('RecipeService', () => {
  let service: RecipeService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeService,
        { provide: PrismaService, useValue: RecipeServiceMock },
      ],
    }).compile();
    service = module.get<RecipeService>(RecipeService);
    prisma = module.get<PrismaService>(PrismaService);
  });
  const dto = {
    title: 'test',
    picture: 'image',
    nameCategory: 'Plat',
    piece: 1,
    preparationTime: '00:10',
    cookingTime: '00:10',
    standingTime: '00:10',
    difficulty: 1,
    ingredient: [{ quantity: 2, unit: 'g', ingredient: 'test' }],
    cookingStep: [],
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
  describe('create', () => {
    it('should be defined', () => {
      const dto = {
        title: 'test',
        picture: 'image',
        nameCategory: 'Plat',
        piece: 1,
        preparationTime: '00:10',
        standingTime: '00:20',
        cookingTime: '00:15',
        difficulty: 1,
        ingredient: [{ quantity: 2, unit: 'g', ingredient: 'test' }],
        cookingStep: [],
      };
      expect(service.create(user, dto)).resolves.toEqual(recipeMocks);
    });
  });
});
