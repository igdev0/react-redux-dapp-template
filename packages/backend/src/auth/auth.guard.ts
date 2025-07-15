import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AccessTokenPayload, AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { CacheStore } from '@nestjs/common/cache';

export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly cache: CacheStore,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = AuthService.extractAccessTokenFromHeader(request);

    if (!token || token === 'undefined') {
      throw new UnauthorizedException('No token provided');
    }
    const payload: AccessTokenPayload = await this.jwtService.verifyAsync(
      token,
      {
        secret: this.config.get('JWT_SECRET'),
      },
    );

    const blackListed = await this.cache.get(
      `blacklisted_access_token:${payload.jti}`,
    );

    if (blackListed) {
      throw new UnauthorizedException('This token was blacklisted');
    }

    const user = await this.userService.findOneById(payload.sub);
    if (!user) {
      return false;
    }
    request['user'] = user;

    return true;
  }
}
