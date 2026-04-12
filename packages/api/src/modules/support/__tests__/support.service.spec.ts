import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { SupportService } from '../support.service';
import { createMockPrismaService } from '../../../../test/helpers/prisma-mock';
import { createMockEventEmitter } from '../../../../test/helpers/event-emitter-mock';

vi.mock('@karfani/shared', () => ({
  generateTicketNumber: vi.fn().mockReturnValue('TKT-ABC123'),
}));

describe('SupportService', () => {
  let service: SupportService;
  let prisma: ReturnType<typeof createMockPrismaService>;
  let events: ReturnType<typeof createMockEventEmitter>;

  beforeEach(() => {
    prisma = createMockPrismaService();
    events = createMockEventEmitter();
    service = new SupportService(prisma as any, events as any);
  });

  describe('createTicket', () => {
    const userId = 'user-001';

    it('creates a ticket without an initial message', async () => {
      const ticketData = { subject: 'Issue with booking', category: 'BOOKING', priority: 'HIGH' };
      const createdTicket = {
        id: 'ticket-1',
        ticketNumber: 'TKT-ABC123',
        userId,
        subject: ticketData.subject,
        category: ticketData.category,
        priority: 'HIGH',
        bookingId: null,
        messages: [],
      };
      prisma.supportTicket.create.mockResolvedValue(createdTicket);

      const result = await service.createTicket(userId, ticketData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(createdTicket);
      const createCall = prisma.supportTicket.create.mock.calls[0][0];
      expect(createCall.data.ticketNumber).toBe('TKT-ABC123');
      expect(createCall.data.messages).toBeUndefined();
    });

    it('creates a ticket with an initial message', async () => {
      const ticketData = {
        subject: 'Need help',
        category: 'GENERAL',
        message: 'Please help me with my caravan',
        bookingId: 'booking-99',
      };
      const createdTicket = {
        id: 'ticket-2',
        ticketNumber: 'TKT-ABC123',
        userId,
        subject: ticketData.subject,
        messages: [{ content: ticketData.message, senderRole: 'CUSTOMER' }],
      };
      prisma.supportTicket.create.mockResolvedValue(createdTicket);

      const result = await service.createTicket(userId, ticketData);

      expect(result.success).toBe(true);
      const createCall = prisma.supportTicket.create.mock.calls[0][0];
      expect(createCall.data.messages).toEqual({
        create: {
          senderId: userId,
          senderRole: 'CUSTOMER',
          content: ticketData.message,
        },
      });
      expect(createCall.data.bookingId).toBe('booking-99');
    });

    it('generates a ticket number using generateTicketNumber', async () => {
      prisma.supportTicket.create.mockResolvedValue({ id: 'ticket-3', messages: [] });

      await service.createTicket(userId, { subject: 'Test', category: 'GENERAL' });

      const createCall = prisma.supportTicket.create.mock.calls[0][0];
      expect(createCall.data.ticketNumber).toBe('TKT-ABC123');
    });

    it('defaults priority to MEDIUM when not provided', async () => {
      prisma.supportTicket.create.mockResolvedValue({ id: 'ticket-4', messages: [] });

      await service.createTicket(userId, { subject: 'Question', category: 'GENERAL' });

      const createCall = prisma.supportTicket.create.mock.calls[0][0];
      expect(createCall.data.priority).toBe('MEDIUM');
    });

    it('emits ticket.created event', async () => {
      const ticket = { id: 'ticket-5', ticketNumber: 'TKT-ABC123', messages: [] };
      prisma.supportTicket.create.mockResolvedValue(ticket);

      await service.createTicket(userId, { subject: 'Test', category: 'GENERAL' });

      expect(events.emit).toHaveBeenCalledWith('ticket.created', ticket);
    });
  });

  describe('findByUser', () => {
    const userId = 'user-001';

    it('returns paginated tickets with defaults', async () => {
      const tickets = [{ id: 't1' }, { id: 't2' }];
      prisma.supportTicket.findMany.mockResolvedValue(tickets);
      prisma.supportTicket.count.mockResolvedValue(2);

      const result = await service.findByUser(userId, {});

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(20);
    });

    it('filters by status when provided', async () => {
      prisma.supportTicket.findMany.mockResolvedValue([]);
      prisma.supportTicket.count.mockResolvedValue(0);

      await service.findByUser(userId, { status: 'OPEN' });

      const findCall = prisma.supportTicket.findMany.mock.calls[0][0];
      expect(findCall.where.status).toBe('OPEN');
    });

    it('calculates totalPages correctly', async () => {
      prisma.supportTicket.findMany.mockResolvedValue([]);
      prisma.supportTicket.count.mockResolvedValue(45);

      const result = await service.findByUser(userId, { page: 2, limit: 10 });

      expect(result.pagination.totalPages).toBe(5);
      expect(result.pagination.page).toBe(2);
    });
  });

  describe('findOne', () => {
    it('returns ticket with messages, booking, user, and assignedTo', async () => {
      const ticket = {
        id: 'ticket-1',
        subject: 'Help',
        messages: [{ content: 'Hello', sender: { fullNameAr: 'محمد', fullNameEn: 'Mohammed' } }],
        booking: { bookingNumber: 'KRF-001', status: 'CONFIRMED' },
        user: { fullNameAr: 'محمد', phone: '+966500000000' },
        assignedTo: { fullNameAr: 'وكيل' },
      };
      prisma.supportTicket.findUnique.mockResolvedValue(ticket);

      const result = await service.findOne('ticket-1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(ticket);
      expect(result.data.messages).toHaveLength(1);
      expect(result.data.booking.bookingNumber).toBe('KRF-001');
      expect(result.data.user.fullNameAr).toBe('محمد');
    });

    it('throws NotFoundException when ticket does not exist', async () => {
      prisma.supportTicket.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('addMessage', () => {
    const ticketId = 'ticket-1';

    it('adds a message as a customer', async () => {
      prisma.supportTicket.findUnique.mockResolvedValue({ id: ticketId, status: 'IN_PROGRESS' });
      prisma.user.findUnique.mockResolvedValue({ roles: ['CUSTOMER'] });
      const createdMessage = {
        id: 'msg-1',
        ticketId,
        senderId: 'user-001',
        senderRole: 'CUSTOMER',
        content: 'Any updates?',
        attachmentUrl: null,
        sender: { fullNameAr: 'محمد', fullNameEn: 'Mohammed' },
      };
      prisma.ticketMessage.create.mockResolvedValue(createdMessage);

      const result = await service.addMessage(ticketId, 'user-001', { content: 'Any updates?' });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(createdMessage);
      const createCall = prisma.ticketMessage.create.mock.calls[0][0];
      expect(createCall.data.senderRole).toBe('CUSTOMER');
      expect(prisma.supportTicket.update).not.toHaveBeenCalled();
    });

    it('adds a message as a support agent and transitions OPEN to IN_PROGRESS', async () => {
      prisma.supportTicket.findUnique.mockResolvedValue({ id: ticketId, status: 'OPEN' });
      prisma.user.findUnique.mockResolvedValue({ roles: ['SUPPORT_AGENT'] });
      prisma.ticketMessage.create.mockResolvedValue({
        id: 'msg-2',
        senderRole: 'SUPPORT_AGENT',
        content: 'We are looking into it',
        sender: { fullNameAr: 'وكيل', fullNameEn: 'Agent' },
      });

      await service.addMessage(ticketId, 'agent-001', { content: 'We are looking into it' });

      const createCall = prisma.ticketMessage.create.mock.calls[0][0];
      expect(createCall.data.senderRole).toBe('SUPPORT_AGENT');
      expect(prisma.supportTicket.update).toHaveBeenCalledWith({
        where: { id: ticketId },
        data: { status: 'IN_PROGRESS' },
      });
    });

    it('does not transition status when ticket is not OPEN', async () => {
      prisma.supportTicket.findUnique.mockResolvedValue({ id: ticketId, status: 'IN_PROGRESS' });
      prisma.user.findUnique.mockResolvedValue({ roles: ['SUPPORT_AGENT'] });
      prisma.ticketMessage.create.mockResolvedValue({ id: 'msg-3', senderRole: 'SUPPORT_AGENT' });

      await service.addMessage(ticketId, 'agent-001', { content: 'Following up' });

      expect(prisma.supportTicket.update).not.toHaveBeenCalled();
    });

    it('does not transition status when customer replies to OPEN ticket', async () => {
      prisma.supportTicket.findUnique.mockResolvedValue({ id: ticketId, status: 'OPEN' });
      prisma.user.findUnique.mockResolvedValue({ roles: ['CUSTOMER'] });
      prisma.ticketMessage.create.mockResolvedValue({ id: 'msg-4', senderRole: 'CUSTOMER' });

      await service.addMessage(ticketId, 'user-001', { content: 'Still waiting' });

      expect(prisma.supportTicket.update).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when ticket does not exist', async () => {
      prisma.supportTicket.findUnique.mockResolvedValue(null);

      await expect(
        service.addMessage('nonexistent', 'user-001', { content: 'Hello' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('emits ticket.messageAdded event', async () => {
      const ticket = { id: ticketId, status: 'IN_PROGRESS' };
      prisma.supportTicket.findUnique.mockResolvedValue(ticket);
      prisma.user.findUnique.mockResolvedValue({ roles: ['CUSTOMER'] });
      const message = { id: 'msg-5', content: 'Thanks' };
      prisma.ticketMessage.create.mockResolvedValue(message);

      await service.addMessage(ticketId, 'user-001', { content: 'Thanks' });

      expect(events.emit).toHaveBeenCalledWith('ticket.messageAdded', { ticket, message });
    });
  });
});
