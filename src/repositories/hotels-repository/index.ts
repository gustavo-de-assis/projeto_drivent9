import { prisma } from '@/config';

async function getHotels() {
  return await prisma.hotel.findMany();
}

async function getHotelRoomsById(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

const hotelRepository = {
  getHotels,
  getHotelRoomsById,
};

export default hotelRepository;
