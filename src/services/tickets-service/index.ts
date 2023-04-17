import { Ticket, TicketType } from '@prisma/client';
import { notFoundError } from '@/errors';
import ticketRepository from '@/repositories/ticket-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

async function getTicketTypes(): Promise<TicketType[]> {
  const ticketTypes = await ticketRepository.findMany();

  return ticketTypes;
}

async function getTicket(userId: number): Promise<Ticket> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicket(enrollment.id);
  if (!ticket) {
    throw notFoundError();
  }

  return ticket;
}

export const ticketService = {
  getTicketTypes,
  getTicket,
};
