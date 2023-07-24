import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createEnrollmentWithAddress,
  createPayment,
  createTicket,
  createTicketTypeHotel,
  createUser,
} from '../factories';
import { createBooking } from '../factories/booking-factory';
import { createHotelWithRooms } from '../factories/hotels-factory';
import { prisma } from '@/config';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
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
  describe('when token is valid', () => {
    it('shuold respond with status 404 when user dosent have a booking yet', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should responde with status 200 and booking data', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const booking = await createBooking(user.id);
      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      const { capacity, createdAt, hotelId, id, name, updatedAt } = booking.Room;
      expect(response.body).toEqual({
        id: booking.id,
        Room: { capacity, createdAt: createdAt.toISOString(), hotelId, id, name, updatedAt: updatedAt.toISOString() },
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

  describe('when token is valid', () => {
    it('should respond with status 400 when body param is not present', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
    it('should respond with status 400 when body param is not valid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const body = {
        roomId: 0,
      };
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 404 for dosent existing room id', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeHotel(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const body = {
        roomId: faker.datatype.number(100),
      };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it('should respond with status 403 for invalid user', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeHotel(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const hotelWithRooms = await createHotelWithRooms();
      const body = {
        roomId: hotelWithRooms.Rooms[0].id,
      };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 200 and bookingId', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeHotel(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const hotelWithRooms = await createHotelWithRooms();

      const body = {
        roomId: hotelWithRooms.Rooms[0].id,
      };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
      const booking = await prisma.booking.findFirst({
        where: {
          roomId: hotelWithRooms.Rooms[0].id,
        },
      });
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({ bookingId: booking.id });
    });
  });
});

describe('PUT /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.put('/booking/1');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 400 when body param is not present', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
    it('should respond with status 400 when body param is not valid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const body = {
        roomId: 0,
      };
      const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
    it('should respond with status 400 when param is not valid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const body = {
        roomId: faker.datatype.number({ min: 1, max: 10 }),
      };
      const response = await server.put('/booking/0').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 404 for dosent existing room id', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeHotel(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const booking = await createBooking(user.id);
      const body = {
        roomId: booking.Room.id + 9,
      };

      const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it('should respond with status 403 for invalid user', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeHotel(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const hotelWithRooms = await createHotelWithRooms();
      const bookingId = faker.datatype.number(10);
      const body = {
        roomId: hotelWithRooms.Rooms[0].id,
      };

      const response = await server.put(`/booking/${bookingId}`).set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 200 and bookingId', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeHotel(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const booking = await createBooking(user.id);
      const hotelWithRooms = await createHotelWithRooms();
      const body = {
        roomId: hotelWithRooms.Rooms[0].id,
      };

      const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({ bookingId: booking.id });
    });
  });
});
