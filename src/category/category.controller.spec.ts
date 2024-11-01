import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { CategoryServiceMocks } from './mocks/category.service.mocks';
import { CategoryController } from './category.controller';

describe('CategoryController', () => {
  let controller: CategoryController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [{ provide: CategoryService, useClass: CategoryServiceMocks }],
    }).compile();
    controller = module.get<CategoryController>(CategoryController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  const createDTO = {
    name: 'test',
  };
  const id = 'uuid';
  describe('create', () => {
    it('create category', () => {
      expect(controller.create(createDTO)).resolves.toEqual('Category created');
    });
  });
  describe('findAll', () => {
    it('find all Category', () => {
      expect(controller.findAll()).resolves.toEqual([
        { id: 'uuid', name: 'test', recipe: [] },
      ]);
    });
  });

  describe('update', () => {
    it('update category', () => {
      expect(controller.update(id, createDTO)).resolves.toEqual("Successfully updated");
    });
  });
  describe("remove",()=>{
    it("remove category",()=>{
        expect(controller.remove(id)).resolves.toEqual("Successfully deleted")
    })
  })
});
