import { IsMongoId, IsInt, Min, IsArray, ArrayNotEmpty, IsEnum, IsOptional } from "class-validator";
import { PlaceType } from "src/schemas/place.schema";

export class CreateOrderDto {
  @IsArray()
  @ArrayNotEmpty()
  items: { menuItem: string; quantity: number }[];

  @IsInt()
  @Min(1)
  placeNumber: number;

  @IsEnum(PlaceType)
  placeType: PlaceType;

  @IsOptional()
  @IsMongoId()
  hotelId?: string; // only for room orders
}
