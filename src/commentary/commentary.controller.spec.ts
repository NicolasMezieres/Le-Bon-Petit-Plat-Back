import { Test, TestingModule } from '@nestjs/testing';
import { CommentaryController } from './commentary.controller';
import { CommentaryService } from './commentary.service';
import { CommentaryServiceMock } from './mocks/commentary.service.mocks';
import { CommentaryMocks } from './mocks/commentary.mock';
describe('CommentaryService', () => {
  let controller: CommentaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentaryController],
      providers: [
        { provide: CommentaryService, useClass: CommentaryServiceMock },
      ],
    }).compile();
    controller = module.get<CommentaryController>(CommentaryController);
  });
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
  const id = '923c3dca-42eb-41b7-9720-67b35a5db759';
  describe('create', () =>
    it('creation', () => {
      expect(controller.create(dto, user)).resolves.toEqual(
        'Commentary created',
      );
    }));

  describe('findAllMyCommentaries', () => {
    it('not found', () => {
      expect(controller.findAllMyCommentaries(userJWT)).resolves.toEqual(
        CommentaryMocks,
      );
    });
  });
  describe('findAllByRecipe', () => {
    it('recipe', () => {
      expect(controller.findAllByRecipe(id)).resolves.toEqual(CommentaryMocks);
    });
  });
  describe('update', () => {
    it('update commentary', () => {
      expect(controller.update(id, userJWT, dto)).resolves.toEqual({
        data: 'Successfuly updated',
      });
    });
  });
  describe('remove', () => {
    it('remove commentary', () => {
      expect(controller.remove(id, userJWT)).resolves.toEqual({
        data: 'Successfully deleted',
      });
    });
  });
});
