import { IsString, IsEmail, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  location: string;

  @IsString()
  logoUrl: string;

  @IsString()
  description?: string;
}
