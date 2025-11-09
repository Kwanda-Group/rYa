// create-menu.dto.ts
import { IsString, IsNotEmpty, IsNumber, Min, IsEnum } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsNotEmpty()
  imageUrl: string; // front-end will send image path after upload

  @IsEnum(['drinks', 'main', 'deserts'])
  category: 'drinks' | 'main' | 'deserts';
}


