import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

export interface AccessTokenPayload {
  sub: string;
  jti: string;
  wallet_address: string;
  exp?: number;
}

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
    private readonly configService: ConfigService,
  ) {}

  static extractRefreshTokenFromHeader(request: Request) {
    return request.cookies['refresh_token'] as string | null;
  }

  static extractAccessTokenFromHeader(request: Request) {
    return request.headers.authorization?.replace('Bearer ', '') ?? null;
  }

  generateAccessToken(payload: AccessTokenPayload) {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('auth.accessTokenTTL'),
      secret: this.configService.get('auth.secret'),
    });
  }

  generateRefreshToken(payload: RefreshTokenPayload) {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('auth.refreshTokenTTL'),
      secret: this.configService.get('auth.secret'),
    });
  }
}
