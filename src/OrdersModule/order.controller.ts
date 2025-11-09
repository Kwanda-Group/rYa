import { Controller, Post, Param, Body, Get, Patch } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './create-order.dto';
import { OrderStatus } from 'src/schemas/order.schema';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('restaurant/:restaurantId/order')
  createOrder(@Param('restaurantId') restaurantId: string, @Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(restaurantId, dto);
  }

  @Get('restaurant/:restaurantId/orders')
  listOrders(@Param('restaurantId') restaurantId: string) {
    return this.orderService.listOrdersForRestaurant(restaurantId);
  }

  @Get('hotel/:hotelId/orders')
  listHotelOrders(@Param('hotelId') hotelId: string) {
    return this.orderService.listOrdersForHotel(hotelId);
  }

  @Get('order/:orderId')
  getOrder(@Param('orderId') orderId: string) {
    return this.orderService.getOrderById(orderId);
  }

  @Patch('order/:orderId/status')
  updateStatus(@Param('orderId') orderId: string, @Body() body: { status: OrderStatus; etaMinutes?: number }) {
    return this.orderService.updateStatus(orderId, body.status, body.etaMinutes);
  }

  @Patch('order/:orderId/cancel')
  cancelOrder(@Param('orderId') orderId: string) {
    return this.orderService.cancelOrder(orderId);
  }
}
