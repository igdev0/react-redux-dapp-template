import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { getMockRes } from '@jest-mock/express';
import { ModuleMocker } from 'jest-mock';
import { AuthService } from './auth.service';

const moduleMocker = new ModuleMocker(global);
describe('AuthController', () => {
  let controller: AuthController;

  const { res, clearMockRes } = getMockRes();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker((token) => {
        if (token === AuthService) {
          return moduleMocker;
        }
        return new ModuleMocker(global);
      })
      .compile();
    clearMockRes();
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
    await controller.getNonce(res);
    expect(res).toHaveBeenCalled();
  });
});
