import { NotFoundException } from '@nestjs/common';

export const CommentaryPrismaMock = {
  recipe: {
    findUnique: jest
      .fn()
      .mockResolvedValue(new NotFoundException('Not found recipe')),
    update: jest.fn(),
  },
};
