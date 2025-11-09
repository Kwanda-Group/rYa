import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OrderService } from './order.service';

@WebSocketGateway({ cors: true })
export class OrdersGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly orderService: OrderService) {}

  // Client subscribes to a table or room
  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.join(room);
    client.emit('joinedRoom', `Joined room ${room}`);
  }

  // Emit order created
  async emitOrderCreated(orderId: string, placeId: string) {
    const order = await this.orderService.getOrderById(orderId);
    this.server.to(placeId).emit('orderCreated', order);
  }

  // Emit order status update
  async emitOrderUpdated(orderId: string, placeId: string) {
    const order = await this.orderService.getOrderById(orderId);
    this.server.to(placeId).emit('orderUpdated', order);
  }
}
