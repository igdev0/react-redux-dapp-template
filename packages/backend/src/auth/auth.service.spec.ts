import {
  AccessTokenPayload,
  AuthService,
  RefreshTokenPayload,
} from './auth.service';
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
        expiresIn: configService.get('auth.refreshTokenTTL') as number,
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

    describe('Refresh token', () => {
      const refreshToken = 'mocked_refresh_token';
      const accessToken = 'mocked_access_token';
      let result: Awaited<ReturnType<typeof service.refresh>>;
      let refreshThreshold: number;

      let refreshTokenPayload: RefreshTokenPayload;

      let accessTokenPayload: AccessTokenPayload;

      beforeEach(() => {
        refreshThreshold = configService.get<number>(
          'auth.refreshTokenExpiryThreshold',
        ) as number;
        refreshTokenPayload = {
          sub: crypto.randomUUID(),
          jti: crypto.randomUUID(),
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + refreshThreshold,
        };
        accessTokenPayload = {
          exp: Math.floor(Date.now() / 1000),
          jti: crypto.randomUUID(),
          sub: crypto.randomUUID(),
          wallet_address: '0x0000',
        };
        jwtService.verifyAsync
          .mockResolvedValueOnce(refreshTokenPayload)
          .mockResolvedValueOnce(accessTokenPayload);

        jwtService.sign
          .mockReturnValueOnce(refreshToken)
          .mockReturnValueOnce(accessToken);
      });
      it('should generate a new refresh token and access token if both access and refresh token passed as arguments', async () => {
        result = await service.refresh(refreshToken, accessToken);

        expect(jwtService.verifyAsync).toHaveBeenCalledWith(refreshToken);
        expect(jwtService.verifyAsync).toHaveBeenCalledWith(accessToken);

        const newRefreshTokenPayload = {
          sub: refreshTokenPayload.sub,
          iat: Math.floor(Date.now()),
          jti: crypto.randomUUID(),
        };

        const remainingExpiry =
          (accessTokenPayload.exp || 0) * 1000 - Math.floor(Date.now());

        expect(cacheManager.set).toHaveBeenCalledWith(
          `blacklisted_access_token:${accessTokenPayload.jti}`,
          accessToken,
          remainingExpiry,
        );

        expect(jwtService.sign).toHaveBeenCalledWith(newRefreshTokenPayload, {
          expiresIn: configService.get('auth.refreshTokenTTL') as number,
        });

        expect(cacheManager.set).toHaveBeenCalledWith(
          `refresh_token:${refreshTokenPayload.jti}`,
          refreshToken,
        );

        // Generate a new refresh token now as the expiry meets the condition
        expect(cacheManager.del).toHaveBeenCalledWith(
          `refresh_token:${refreshTokenPayload.jti}`,
        );

        expect(result).toEqual({
          newRefreshToken: refreshToken,
          newAccessToken: accessToken,
        });
      });

      it('should query the user database if the access token is not passed', async () => {
        const user: User = {
          notifications: [],
          updated_at: new Date(),
          created_at: new Date(),
          wallet_address: '0x000',
          id: crypto.randomUUID(),
        };

        userRepository.findOne.mockResolvedValue(user);
        result = await service.refresh(refreshToken, null);
        const remainingExpiry =
          (accessTokenPayload.exp || 0) * 1000 - Math.floor(Date.now());

        expect(cacheManager.set).not.toHaveBeenCalledWith(
          `blacklisted_access_token:${accessTokenPayload.jti}`,
          accessToken,
          remainingExpiry,
        );

        expect(userRepository.findOne).toHaveBeenCalledWith({
          where: { id: refreshTokenPayload.sub },
        });
      });
    });
  });
});
