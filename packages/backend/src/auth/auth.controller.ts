import {
  Body,
  Controller,
  Get,
  HttpStatus, Inject,
  Logger,
  Post,
  Res,
} from '@nestjs/common';
import {
  AccessTokenPayload,
  AuthService,
  RefreshTokenPayload,
} from './auth.service';
import { generateNonce, SiweMessage } from 'siwe';
import { Response } from 'express';
import { SignUpDto } from './dto/signup.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { CacheManagerStore } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Controller('auth')
export class AuthController {
  logger = new Logger('AuthController');

  constructor(
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private readonly cache: CacheManagerStore,
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Get('nonce')
  async getNonce(@Res() res: Response) {
    const nonce = generateNonce();
    await this.cache.set(nonce, 'valid');
    res.status(HttpStatus.OK).send({ nonce });
  }

  @Post('signup')
  async signUp(@Body() body: SignUpDto, @Res() res: Response) {
    const nonceStatus = (await this.cache.get(body.nonce)) as string;
    if (!nonceStatus) {
      return res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({ error: 'Invalid nonce' });
    }
    try {
      const user = await this.userService.findOneByWalletAddress(
        body.wallet_address,
      );
      if (user) {
        return res
          .status(HttpStatus.CONFLICT)
          .json({ error: 'User already exists' });
      }
    } catch (err) {
      this.logger.error(err);
    }

    // Verifying the user
    try {
      const siweMessage = new SiweMessage(body.message);
      const siweResponse = await siweMessage.verify({
        nonce: body.nonce,
        signature: body.signature,
      });

      if (siweResponse.error) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: 'Failed to verify user' });
      }
    } catch (err) {
      this.logger.error(err);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'Failed to verify user' });
    }

    // Creating the new user
    let user: User;
    try {
      user = await this.userService.create({
        wallet_address: body.wallet_address,
      });
    } catch (err) {
      this.logger.error(err);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Failed to create the user' });
    }

    // Sign the access token and generate the refresh token
    // ==========================================
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

    const accessToken =
      this.authService.generateAccessToken(accessTokenPayload);
    const refreshToken =
      this.authService.generateRefreshToken(refreshTokenPayload);

    await this.cache.set(
      `refresh_token:${refreshTokenPayload.jti}`,
      accessTokenPayload.sub,
      refreshTokenPayload.iat,
    );

    const secure = this.config.get('auth.secure') as boolean;
    const refreshTokenTTL = this.config.get('auth.refreshTokenTTL') as number;
    const accessTokenTTL = this.config.get('auth.accessTokenTTL') as number;

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure,
      sameSite: 'strict',
      maxAge: refreshTokenTTL * 1000,
    });

    res.status(HttpStatus.OK).json({ accessToken, ttl: accessTokenTTL });
  }

  @Post('signin')
  signIn() {
    return 'Sign in';
  }
}
