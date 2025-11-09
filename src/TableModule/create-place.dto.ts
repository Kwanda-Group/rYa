import { IsInt, IsOptional, IsEnum, Min } from 'class-validator';
import { PlaceType } from 'src/schemas/place.schema';

export class CreatePlaceDto {
  @IsEnum(PlaceType)
  type: PlaceType;

  @IsInt()
  @Min(1)
  number: number;

  // Optional depending on type
  @IsOptional()
  restaurantId?: string;

  @IsOptional()
  hotelId?: string;
}
