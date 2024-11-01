import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthPrismaMock } from './mocks/auth.prisma.mock';
import { EmailService } from 'src/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { AuthMock } from './mocks/auth.mock';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { EmailServiceMocks } from './mocks/auth.email.service.mocks';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: AuthPrismaMock },
        { provide: EmailService, useValue: EmailServiceMocks },
        JwtService,
        PrismaService,
        JwtService,
        JwtStrategy,
        ConfigService,
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  const dto = {
    firstName: 'test',
    lastName: 'test',
    email: 'glbzroz@gmail.com',
    username: 'egoz',
    password: 'Alpin@73',
  };
  describe('signup', () => {
    it('register', () => {
      jest.spyOn(AuthPrismaMock.user, 'findFirst').mockResolvedValue(null);
      jest.spyOn(AuthPrismaMock.role, 'findUnique').mockResolvedValue({
        id: 'effebcf7-d0db-450b-a395-d4b4c579cc41',
        name: 'User',
      });
      jest
        .spyOn(AuthPrismaMock.user, 'create')
        .mockRejectedValue({ id: 'uuid', ...dto });
      expect(service.signup(dto)).resolves.toEqual(
        'Vous aller recevoir un mail de confirmation.',
      );
    });
    it('should throw a forbidden exception', () => {
      jest.spyOn(AuthPrismaMock.user, 'findFirst').mockResolvedValue(AuthMock);
      expect(() => service.signup(dto)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });
  });
});
