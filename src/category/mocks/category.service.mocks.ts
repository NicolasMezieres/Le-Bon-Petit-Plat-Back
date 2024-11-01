export class CategoryServiceMocks {
  findAll = jest
    .fn()
    .mockResolvedValue([{ id: 'uuid', name: 'test', recipe: [] }]);
  create = jest.fn().mockResolvedValue('Category created');
  update = jest.fn().mockResolvedValue('Successfully updated');
  remove = jest.fn().mockResolvedValue('Successfully deleted');
}
