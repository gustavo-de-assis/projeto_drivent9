import { prisma } from '@/config';

async function getHotels() {
  return await prisma.hotel.findMany();
}

const hotelRepository = {
  getHotels,
};

export default hotelRepository;
