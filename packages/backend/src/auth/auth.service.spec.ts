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

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: Mocked<JwtService>;
  let configService: Mocked<ConfigService>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
});
