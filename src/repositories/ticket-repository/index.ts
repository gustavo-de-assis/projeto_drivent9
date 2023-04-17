import { Ticket } from '@prisma/client';
import { prisma } from '@/config';

async function findMany() {
  return await prisma.ticketType.findMany();
}

async function findTicket(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: {
      enrollmentId,
    },
    include: {
      TicketType: true,
    },
  });
}

async function createTicket(ticket: TicketInfo) {
  return prisma.ticket.create({
    data: {
      ...ticket,
    },
  });
}

const ticketRepository = {
  findMany,
  findTicket,
  createTicket,
};

export type TicketInfo = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;

export default ticketRepository;
