import { Test, TestingModule } from '@nestjs/testing';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { RecipeServiceMock } from './mocks/recipe.service.mock';
import { recipeMocks } from './mocks/recipe.mocks';

describe('RecipeController', () => {
  let controller: RecipeController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipeController],
      providers: [{ provide: RecipeService, useClass: RecipeServiceMock }],
    }).compile();

    controller = module.get<RecipeController>(RecipeController);
  });
  describe('post', () => {
    it('should be defined', () => {
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
      expect(controller.create(user, dto)).resolves.toEqual(recipeMocks);
    });
  });
});
