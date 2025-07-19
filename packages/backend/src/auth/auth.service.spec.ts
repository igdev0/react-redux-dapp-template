import { AuthService } from './auth.service';
import { Mocked, TestBed } from '@suites/unit';
import { CacheManagerStore } from 'cache-manager';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { getMockReq } from '@jest-mock/express';

const MOCKED_CONFIG = {
  refreshTokenTTL: 60 * 60 * 24 * 7, // 7 days in seconds
  secret: 'Secret',
  accessTokenTTL: 60 * 15, // 15 mins in seconds
  refreshTokenExpiryThreshold: 60 * 60 * 24, // 24 hours
  secure: true,
};

const DATE_NOW = 1752905802352;

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: Mocked<JwtService>;
  let configService: Mocked<ConfigService>;

  let cacheManager: Mocked<CacheManagerStore>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userRepository: Mocked<Repository<User>>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(AuthService).compile();

    service = unit;
    configService = unitRef.get(ConfigService);
    jwtService = unitRef.get(JwtService);
    cacheManager = unitRef.get(CACHE_MANAGER);
    userRepository = unitRef.get('UserRepository');

    configService.get.mockImplementation((property: string) => {
      return MOCKED_CONFIG[property.split('.')[1]];
    });
  });

  describe('Static methods', () => {
    it('should be able to extractAccessTokenFromHeader', () => {
      const req = getMockReq();
      req.headers.authorization = 'Bearer some_access_token';
      expect(AuthService.extractAccessTokenFromHeader(req)).toEqual(
        'some_access_token',
      );
    });

    it('should be able to extractRefreshTokenFromHeader', () => {
      const req = getMockReq();
      req.cookies['refresh_token'] = 'some_refresh_token';
      expect(AuthService.extractRefreshTokenFromHeader(req)).toEqual(
        'some_refresh_token',
      );
    });
  });

  describe('Utils', () => {
    beforeEach(() => {
      globalThis.crypto = {
        subtle: crypto.subtle,
        getRandomValues: jest.fn(),
        randomUUID(): `${string}-${string}-${string}-${string}-${string}` {
          return 'sample-uuid-created-just-now';
        },
      };

      globalThis.Date.now = jest.fn().mockReturnValue(DATE_NOW);
      jwtService.sign.mockClear();
    });

    it('should be able to generate access token', () => {
      expect(service).toBeDefined();
      jwtService.sign.mockReturnValue('signed_access_token');
      const accessToken = service.generateAccessToken({
        sub: 'some-uuid',
        jti: 'some-uuid',
        wallet_address: '0x00000',
      });

      expect(accessToken).toEqual('signed_access_token');
      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          sub: 'some-uuid',
          jti: 'some-uuid',
          wallet_address: '0x00000',
        },
        {
          expiresIn: MOCKED_CONFIG.accessTokenTTL,
          secret: MOCKED_CONFIG.secret,
        },
      );
    });

    it('should be able to generate refresh token', () => {
      expect(service).toBeDefined();
      jwtService.sign.mockReturnValue('signed_refresh_token');

      const payload = {
        sub: 'some-uuid',
        jti: 'some-id',
        iat: Date.now() / 1000,
      };
      const refreshToken = service.generateRefreshToken(payload);

      expect(refreshToken).toEqual('signed_refresh_token');
      expect(jwtService.sign).toHaveBeenCalledWith(payload, {
        expiresIn: MOCKED_CONFIG.refreshTokenTTL,
      });
    });
  });

  describe('Auth', () => {
    it('should be able to sign in', async () => {
      const user = {
        id: 'some-user-uuid',
        wallet_address: '0x00000',
        created_at: new Date('20-05-1995'),
        updated_at: new Date('20-05-1995'),
        notifications: [],
      };
      const result = await service.signIn(user);

      const accessTokenPayload = {
        wallet_address: user.wallet_address,
        sub: user.id,
        jti: crypto.randomUUID(),
      };
      expect(jwtService.sign).toHaveBeenCalledWith(accessTokenPayload, {
        expiresIn: MOCKED_CONFIG.accessTokenTTL,
        secret: MOCKED_CONFIG.secret,
      });

      const refreshTokenPayload = {
        sub: user.id,
        jti: crypto.randomUUID(),
        iat: Math.floor(Date.now() / 1000),
      };

      expect(jwtService.sign).toHaveBeenCalledWith(refreshTokenPayload, {
        expiresIn: MOCKED_CONFIG.refreshTokenTTL,
      });
      expect(cacheManager.set).toHaveBeenCalledWith(
        `refresh_token:${refreshTokenPayload.jti}`,
        accessTokenPayload.sub,
        refreshTokenPayload.iat,
      );

      expect(jwtService.sign).toHaveBeenCalledTimes(2);

      expect(result).toEqual({
        accessToken: service.generateAccessToken(accessTokenPayload),
        refreshToken: service.generateRefreshToken(refreshTokenPayload),
        accessTokenTTL: configService.get<number>('auth.accessTokenTTL'),
        refreshTokenTTL: configService.get<number>('auth.refreshTokenTTL'),
      });
    });
  });
});
