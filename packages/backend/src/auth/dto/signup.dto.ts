import { IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  wallet_address: string;
  @IsString()
  nonce: string;
  @IsString()
  message: string;
  @IsString()
  signature: string;
}
