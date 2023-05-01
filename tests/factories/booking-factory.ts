import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotelWithRooms(qtRooms?: number, perRoomCap?: number) {
  const rooms = [];

  if (!qtRooms) {
    qtRooms = faker.datatype.number({ min: 1, max: 5 });
  }

  for (let i = 0; i < qtRooms; i++) {
    rooms.push({
      name: faker.lorem.word(),
      capacity: perRoomCap !== undefined ? perRoomCap : faker.datatype.number({ min: 1, max: 3 }),
    });
  }

  return prisma.hotel.create({
    data: {
      name: faker.lorem.word(),
      image: faker.image.imageUrl(),
      Rooms: {
        create: rooms,
      },
    },
    include: {
      Rooms: true,
    },
  });
}

export async function createBooking(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}
