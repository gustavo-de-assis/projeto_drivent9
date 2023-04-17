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

const ticketRepository = {
  findMany,
  findTicket,
};

export default ticketRepository;
