import { prisma } from '@/config';

async function findUserBooking(userId: number) {
  return await prisma.booking.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
      Room: true,
    },
  });
}

async function findBooking(id: number) {
  return await prisma.room.findUnique({
    where: {
      id,
    },
    include: {
      Booking: true,
    },
  });
}

async function insertBooking(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

const bookingRepository = {
  findUserBooking,
  findBooking,
  insertBooking,
};

export default bookingRepository;
