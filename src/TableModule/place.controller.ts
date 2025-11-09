import { Controller, Post, Param, Body, Get } from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './create-place.dto';
import { PlaceType } from 'src/schemas/place.schema';

@Controller()
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  // Create a table for a restaurant
  @Post('restaurant/:restaurantId/table')
  async createTable(
    @Param('restaurantId') restaurantId: string,
    @Body() body: CreatePlaceDto,
  ) {
    const place = await this.placeService.create(
      PlaceType.TABLE,
      body.number,
      restaurantId,
    );
    return { success: true, place };
  }

  // List tables for a restaurant
  @Get('restaurant/:restaurantId/table')
  async listTables(@Param('restaurantId') restaurantId: string) {
    return this.placeService.listForRestaurant(restaurantId);
  }

  // Create a room for a hotel
  @Post('hotel/:hotelId/room')
  async createRoom(
    @Param('hotelId') hotelId: string,
    @Body() body: CreatePlaceDto,
  ) {
    const place = await this.placeService.create(
      PlaceType.ROOM,
      body.number,
      undefined,
      hotelId,
    );
    return { success: true, place };
  }

  // List rooms for a hotel
  @Get('hotel/:hotelId/room')
  async listRooms(@Param('hotelId') hotelId: string) {
    return this.placeService.listForHotel(hotelId);
  }
}
