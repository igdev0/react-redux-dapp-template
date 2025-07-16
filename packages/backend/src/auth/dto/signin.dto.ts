import { IsString } from 'class-validator';

export default class SigninDto {
  @IsString()
  wallet_address: string;
  @IsString()
  nonce: string;
  @IsString()
  message: string;
  @IsString()
  signature: string;
}
