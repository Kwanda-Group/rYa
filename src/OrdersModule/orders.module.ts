import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../schemas/order.schema';
import { Menu, MenuSchema } from '../schemas/menu.schema';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrdersGateway } from './orders.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Menu.name, schema: MenuSchema }, // for validating menu items
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService , OrdersGateway],
  exports: [OrderService],
})
export class OrdersModule {}
