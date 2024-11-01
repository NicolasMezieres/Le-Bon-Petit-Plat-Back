import { CommentaryMocks } from './commentary.mock';

export class CommentaryServiceMock {
  create = jest.fn().mockResolvedValue('Commentary created');
  findAllMyCommentaries = jest.fn().mockResolvedValue(CommentaryMocks);
  findAllByRecipe = jest.fn().mockResolvedValue(CommentaryMocks);
  update = jest.fn().mockResolvedValue({ data: 'Successfuly updated' });
  remove = jest.fn().mockResolvedValue({ data: 'Successfully deleted' });
}
