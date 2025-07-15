import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { generateNonce } from 'siwe';
import { CacheStore } from '@nestjs/common/cache';
import { Response } from 'express';
import { SignUpDto } from './dto/signup.dto';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly cache: CacheStore,
  ) {}

  @Get('nonce')
  async getNonce(@Res() res: Response) {
    const nonce = generateNonce();
    await this.cache.set(nonce, 'valid');
    res.status(HttpStatus.OK).send({ nonce });
  }

  @Post('signup')
  async signUp(@Body() body: SignUpDto, @Res() res: Response) {
    const nonceStatus = await this.cache.get(body.nonce);
    if (!nonceStatus) {
      return res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .send({ message: 'Invalid nonce' });
    }

    await this.userService.findOneByWalletAddress(body.wallet_address);
  }

  @Post('signin')
  signIn() {
    return 'Sign in';
  }
}
