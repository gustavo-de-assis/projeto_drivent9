import { Ticket, TicketStatus } from '@prisma/client';
import { prisma } from '@/config';

async function findMany() {
  return await prisma.ticketType.findMany();
}

async function findTicketByEnrollment(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: {
      enrollmentId,
    },
    include: {
      TicketType: true,
    },
  });
}

async function findTicketById(ticketId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
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

async function ticketProcessPayment(ticketId: number) {
  return await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: TicketStatus.PAID,
    },
  });
}

const ticketRepository = {
  findMany,
  findTicketByEnrollment,
  findTicketById,
  createTicket,
  ticketProcessPayment,
};

export type TicketInfo = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;

export default ticketRepository;
