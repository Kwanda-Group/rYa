import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OrderService } from './order.service';

@Injectable()
@WebSocketGateway({ cors: true })
export class OrdersGateway {
  @WebSocketServer()
  server: Server;

  // use forwardRef here
  constructor(
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
  ) {}

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.join(room);
    client.emit('joinedRoom', `Joined room ${room}`);
  }

  async emitOrderCreated(orderId: string, placeId: string) {
    const order = await this.orderService.getOrderById(orderId);
    this.server.to(placeId).emit('orderCreated', order);
  }

  async emitOrderUpdated(orderId: string, placeId: string) {
    const order = await this.orderService.getOrderById(orderId);
    this.server.to(placeId).emit('orderUpdated', order);
  }
}
