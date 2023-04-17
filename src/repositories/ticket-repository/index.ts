import { prisma } from '@/config';

async function findMany() {
  return await prisma.ticketType.findMany();
}

const ticketRepository = {
  findMany,
};

export default ticketRepository;
