import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthServiceMocks } from './mocks/auth.service.mock';
import { Role } from 'utils/const';

describe('AuthController', () => {
  let controller: AuthController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useClass: AuthServiceMocks }],
    }).compile();
    controller = module.get<AuthController>(AuthController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  const dto = {
    firstName: 'test',
    lastName: 'test',
    email: 'test@gmail.com',
    username: 'test',
    password: 'test',
  };
  describe('signup', () => {
    it('register', () => {
      expect(controller.signup(dto)).resolves.toEqual({ data: 'Send email' });
    });
  });
});
