import { Injectable, BadRequestException, NotFoundException, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from '../schemas/order.schema';
import { Menu } from '../schemas/menu.schema';
import { CreateOrderDto } from './create-order.dto';
import { OrdersGateway } from './orders.gateway';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Menu.name) private menuModel: Model<Menu>,
    @Inject(forwardRef(() => OrdersGateway))
    private readonly ordersGateway: OrdersGateway
  ) {}

  async createOrder(restaurantId: string, dto: CreateOrderDto) {
    // Validate menu items exist
    const menuIds = dto.items.map(item => item.menuItem);
    const menuItems = await this.menuModel.find({ _id: { $in: menuIds }, restaurant: restaurantId });
    if (menuItems.length !== dto.items.length) {
      throw new BadRequestException('Some menu items do not exist for this restaurant.');
    }

    const order = await this.orderModel.create({
      restaurant: restaurantId,
      hotel: dto.hotelId || undefined,
      placeNumber: dto.placeNumber,
      placeType: dto.placeType,
      items: dto.items.map(i => ({ menuItem: new Types.ObjectId(i.menuItem), quantity: i.quantity })),
      status: OrderStatus.PENDING,
      etaMinutes: 15,
    });

    // Notify via WebSocket
    const placeId = `${dto.placeType}-${dto.placeNumber}`;
    this.ordersGateway.emitOrderCreated((order._id as Types.ObjectId).toString(), placeId);

    this.logger.log(`Created new order ${order._id} for ${dto.placeType} ${dto.placeNumber}`);
    return order;
  }

  async updateStatus(orderId: string, status: OrderStatus, etaMinutes?: number) {
    const update: any = { status };
    if (etaMinutes !== undefined) update.etaMinutes = etaMinutes;

    const order = await this.orderModel.findByIdAndUpdate(orderId, update, { new: true });
    if (!order) throw new NotFoundException('Order not found');

    const placeId = `${order.placeType}-${order.placeNumber}`;
    this.ordersGateway.emitOrderUpdated((order._id as Types.ObjectId).toString(), placeId);

    this.logger.log(`Updated order ${order._id} status to ${status}`);
    return order;
  }

  async cancelOrder(orderId: string) {
    return this.updateStatus(orderId, OrderStatus.CANCELLED);
  }

  async listOrdersForRestaurant(restaurantId: string) {
    return this.orderModel.find({ restaurant: restaurantId }).sort({ createdAt: -1 }).populate('items.menuItem').lean();
  }

  async listOrdersForHotel(hotelId: string) {
    return this.orderModel.find({ hotel: hotelId }).sort({ createdAt: -1 }).populate('items.menuItem').lean();
  }

  async getOrderById(orderId: string) {
    const order = await this.orderModel.findById(orderId).populate('items.menuItem');
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
