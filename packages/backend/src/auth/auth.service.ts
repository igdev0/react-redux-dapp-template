import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { User } from '../user/entities/user.entity';
import { CacheManagerStore } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

/**
 * Payload used for generating an access token.
 *
 * @property sub - Subject (typically the user ID)
 * @property jti - Unique token identifier (used to track/revoke tokens)
 * @property wallet_address - The user's wallet address
 * @property exp - Optional expiration timestamp (added automatically by JWT library if not provided)
 */
export interface AccessTokenPayload {
  sub: string;
  jti: string;
  wallet_address: string;
  exp?: number;
}

/**
 * Payload used for generating a refresh token.
 *
 * @property sub - Subject (typically the user ID)
 * @property jti - Unique token identifier
 * @property iat - Issued-at timestamp
 * @property exp - Optional expiration timestamp
 */
export interface RefreshTokenPayload {
  sub: string;
  jti: string;
  iat: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cache: CacheManagerStore,
  ) {}

  /**
   * Extracts the refresh token from the request cookies.
   *
   * @param request - The incoming HTTP request
   * @returns The refresh token string if present, otherwise null
   */
  static extractRefreshTokenFromHeader(request: Request) {
    return request.cookies['refresh_token'] as string | null;
  }

  /**
   * Extracts the access token from the Authorization header (Bearer scheme).
   *
   * @param request - The incoming HTTP request
   * @returns The access token string if present, otherwise null
   */
  static extractAccessTokenFromHeader(request: Request) {
    return request.headers.authorization?.replace('Bearer ', '') ?? null;
  }

  /**
   * Generates a signed JWT access token using the provided payload.
   *
   * @param payload - The access token payload
   * @returns A signed JWT access token string
   */
  generateAccessToken(payload: AccessTokenPayload) {
    return this.jwtService.sign(payload, {
      expiresIn: this.config.get('auth.accessTokenTTL'),
      secret: this.config.get('auth.secret'),
    });
  }

  /**
   * Generates a signed JWT refresh token using the provided payload.
   *
   * @param payload - The refresh token payload
   * @returns A signed JWT refresh token string
   */
  generateRefreshToken(payload: RefreshTokenPayload) {
    return this.jwtService.sign(payload, {
      expiresIn: this.config.get('auth.refreshTokenTTL'),
      secret: this.config.get('auth.secret'),
    });
  }

  /**
   * Signs user in, generates refresh and access tokens.
   *
   * @param user – The user entity obtained from User db.
   * @returns {Promise<{
   *    accessToken: string,
   *    refreshToken: string,
   *    refreshTokenTTL: number,
   *    accessTokenTTL: number
   * }>}
   * */
  async signIn(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
    refreshTokenTTL: number;
    accessTokenTTL: number;
  }> {
    const accessTokenPayload: AccessTokenPayload = {
      wallet_address: user.wallet_address as string,
      sub: user.id as string,
      jti: crypto.randomUUID(),
    };

    const nowInSeconds = Math.floor(Date.now() / 1000);

    const refreshTokenPayload: RefreshTokenPayload = {
      sub: user.id as string,
      jti: crypto.randomUUID(),
      iat: nowInSeconds,
    };

    const accessToken = this.generateAccessToken(accessTokenPayload);
    const refreshToken = this.generateRefreshToken(refreshTokenPayload);

    await this.cache.set(
      `refresh_token:${refreshTokenPayload.jti}`,
      accessTokenPayload.sub,
      refreshTokenPayload.iat,
    );

    const refreshTokenTTL = this.config.get('auth.refreshTokenTTL') as number;
    const accessTokenTTL = this.config.get('auth.accessTokenTTL') as number;
    return { refreshTokenTTL, accessTokenTTL, accessToken, refreshToken };
  }

  /**
   * Removes the refreshToken from cache and blacklists the accessToken
   *
   * @param accessToken – The user bearer token
   * @param refreshToken – The refresh token used to generate a new access token
   * */
  async signOut(accessToken: string | null, refreshToken: string | null) {
    if (refreshToken) {
      // If the verification will fail, let the controller handle the error
      const payload: RefreshTokenPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.config.get('JWT_SECRET'),
        },
      );
      // Delete the refresh token, so the existing ones can't be used no more.
      // This service
      await this.cache.del(`refresh_token:${payload.jti}`);
    }

    if (accessToken) {
      const accessTokenPayload: AccessTokenPayload =
        await this.jwtService.verifyAsync(accessToken);
      // Store the jti in cache with its remaining expiry time
      const remainingExpiry =
        (accessTokenPayload.exp || 0) * 1000 - Math.floor(Date.now());
      await this.cache.set(
        `blacklisted_access_token:${accessTokenPayload.jti}`,
        accessToken,
        remainingExpiry,
      );
    }
  }
}
