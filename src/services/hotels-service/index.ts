import { notFoundError, paymentRequiredError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelRepository from '@/repositories/hotels-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function listUserHotels(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw notFoundError();
  }

  if (ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw paymentRequiredError();
  }
}

async function findHotels(userId: number) {
  await listUserHotels(userId);

  return await hotelRepository.getHotels();
}

async function findHotelRooms(userId: number, hotelId: number) {
  await listUserHotels(userId);

  const hotel = await hotelRepository.getHotelRoomsById(hotelId);

  if (!hotel) {
    throw notFoundError();
  }

  return hotel;
}

export const hotelService = {
  findHotels,
  findHotelRooms,
};
