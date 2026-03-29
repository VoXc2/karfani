import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway({
  cors: {
    origin: [process.env.WEB_URL || 'http://localhost:3000'],
    credentials: true,
  },
  namespace: '/events',
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger('EventsGateway');
  private readonly viewerCounts = new Map<string, Set<string>>();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Remove from all viewer counts
    for (const [caravanId, viewers] of this.viewerCounts) {
      if (viewers.delete(client.id)) {
        this.server.to(`caravan:${caravanId}`).emit('viewers:count', {
          caravanId,
          count: viewers.size,
        });
      }
    }
  }

  @SubscribeMessage('caravan:view')
  handleCaravanView(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { caravanId: string },
  ) {
    const { caravanId } = data;
    if (!this.viewerCounts.has(caravanId)) {
      this.viewerCounts.set(caravanId, new Set());
    }
    this.viewerCounts.get(caravanId)!.add(client.id);
    client.join(`caravan:${caravanId}`);

    this.server.to(`caravan:${caravanId}`).emit('viewers:count', {
      caravanId,
      count: this.viewerCounts.get(caravanId)!.size,
    });
  }

  @SubscribeMessage('caravan:leave')
  handleCaravanLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { caravanId: string },
  ) {
    const { caravanId } = data;
    this.viewerCounts.get(caravanId)?.delete(client.id);
    client.leave(`caravan:${caravanId}`);

    this.server.to(`caravan:${caravanId}`).emit('viewers:count', {
      caravanId,
      count: this.viewerCounts.get(caravanId)?.size || 0,
    });
  }

  @OnEvent('booking.created')
  handleBookingCreated(payload: any) {
    this.server.emit('booking:new', {
      type: 'booking',
      message: `حجز جديد في ${payload.location || 'المملكة'}`,
      timestamp: new Date().toISOString(),
    });
  }

  @OnEvent('booking.statusChanged')
  handleBookingStatusChanged(payload: any) {
    if (payload.userId) {
      this.server.to(`user:${payload.userId}`).emit('booking:status', {
        bookingId: payload.bookingId,
        status: payload.status,
      });
    }
  }

  // Method to send notification to specific user
  sendToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }
}
