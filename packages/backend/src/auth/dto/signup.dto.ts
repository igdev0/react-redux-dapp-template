import { IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  address: string;
  @IsString()
  nonce: string;
}
