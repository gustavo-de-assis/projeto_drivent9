import { TicketType } from '@prisma/client';
import { notFoundError } from '@/errors';
import ticketRepository from '@/repositories/ticket-repository';

async function getTicketTypes(): Promise<TicketType[]> {
  const ticketTypes = await ticketRepository.findMany();

  return ticketTypes;
}

export const ticketService = {
  getTicketTypes,
};
