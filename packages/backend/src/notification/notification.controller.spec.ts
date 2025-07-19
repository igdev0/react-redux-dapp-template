import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { ModuleMocker } from 'jest-mock';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

const typeormModule = new ModuleMocker(global);
const authModule = new ModuleMocker(global);
const userModule = new ModuleMocker(global);
describe('NotificationController', () => {
  let controller: NotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
    })
      .useMocker((token) => {
        if (token === TypeOrmModule) {
          return typeormModule;
        }
        if (token === AuthModule) {
          return authModule;
        }

        if (token === UserModule) {
          return userModule;
        }
        return new ModuleMocker(global);
      })
      .compile();

    controller = module.get<NotificationController>(NotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
