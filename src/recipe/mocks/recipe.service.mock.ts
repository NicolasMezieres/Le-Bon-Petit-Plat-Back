import { recipeMocks } from './recipe.mocks';

export class RecipeServiceMock {
  create = jest.fn().mockResolvedValue(recipeMocks);
  findAll = jest.fn();
  findByUser = jest.fn();
  searchMyRecipes = jest.fn();
  bestRated = jest.fn();
  mostRecent = jest.fn();
  search = jest.fn();
  findById = jest.fn();
  update = jest.fn();
  remove = jest.fn();
}
