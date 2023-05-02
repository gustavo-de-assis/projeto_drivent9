import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  createBooking,
  createHotelWithRooms,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

afterEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('When token is valid', () => {
    it('should respond with status 404 when user has no enrollment ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when user has no ticket ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when user has no booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and booking info', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotelWithRooms();
      const room = hotel.Rooms[0];
      const booking = await createBooking(user.id, room.id);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      const Room = {
        ...room,
        createdAt: room.createdAt.toISOString(),
        updatedAt: room.updatedAt.toISOString(),
      };

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room,
      });
    });
  });
});

describe('POST /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('When token is valid', () => {
    it('should respond with status 403 when user has no enrollment ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const body = { roomId: 0 };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when user has no ticket ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const body = { roomId: 0 };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 403 when user hasn't paid the ticket yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();

      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const body = { roomId: 0 };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 403 when ticket doesn't includes hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false);

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const body = { roomId: 0 };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 404 when roomId doesn't exists", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(true);

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const body = { roomId: 0 };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 403 when there isn't rooms available", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(true);

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const userTwo = await createUser();
      const hotel = await createHotelWithRooms(1, 1);
      const roomId = hotel.Rooms[0].id;

      await createBooking(userTwo.id, roomId);

      const body = { roomId };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 200 and bookingId when successfuly post', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(true);

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotelWithRooms(1, 1);
      const roomId = hotel.Rooms[0].id;

      const body = { roomId };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual({
        bookingId: expect.any(Number),
      });
    });
  });
});

describe('PUT /booking/:bookingId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.put('/booking/0');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.put('/booking/0').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.put('/booking/0').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('When token is valid', () => {
    it('should respond with status 403 when user has no enrollment ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const body = { roomId: 0 };

      const response = await server.put('/booking/0').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when user has no ticket ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const body = { roomId: 0 };

      const response = await server.put('/booking/0').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 403 when user hasn't paid the ticket yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();

      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const body = { roomId: 0 };

      const response = await server.put('/booking/0').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 403 when ticket doesn't includes hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false);

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const body = { roomId: 0 };

      const response = await server.put('/booking/0').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 404 when roomId doesn't exists", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(true);

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const body = { roomId: 0 };

      const response = await server.put('/booking/0').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 403 when there isn't rooms available", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(true);

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const userTwo = await createUser();
      const hotel = await createHotelWithRooms(1, 1);
      const roomId = hotel.Rooms[0].id;

      await createBooking(userTwo.id, roomId);

      const body = { roomId };

      const response = await server.put('/booking/0').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 403 when rooms doesn't belong to user", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(true);

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const userTwo = await createUser();
      const hotel = await createHotelWithRooms(1, 1);
      const roomId = hotel.Rooms[0].id;

      const userTwoBooking = await createBooking(userTwo.id, roomId);

      const body = { roomId: hotel.Rooms[0].id };

      const response = await server
        .put(`/booking/${userTwoBooking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(body);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 200 and bookingId when successfuly update booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(true);

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotelWithRooms(2, 4);
      const booking = await createBooking(user.id, hotel.Rooms[0].id);

      const body = { roomId: hotel.Rooms[1].id };

      const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual({
        bookingId: expect.any(Number),
      });
    });
  });
});
