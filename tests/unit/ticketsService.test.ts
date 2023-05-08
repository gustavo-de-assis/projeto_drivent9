import ticketsRepository from '@/repositories/tickets-repository';
import ticketService from '@/services/tickets-service';

describe('ticketsType unit test suite', () => {
  it('should return ticket info', async () => {
    jest.spyOn(ticketsRepository, 'findTicketTypes').mockImplementation((): any => {
      return {
        id: 1,
        name: 'aaa',
        price: 3000,
        isRemote: true,
        includesHotel: false,
        createdAt: '2022-02-02',
        updatedAt: '2022-02-02',
      };
    });

    const ticket = await ticketService.getTicketType();

    expect(ticket).toEqual(
      expect.objectContaining({
        id: 1,
        name: 'aaa',
        price: 3000,
        isRemote: true,
        includesHotel: false,
        createdAt: '2022-02-02',
        updatedAt: '2022-02-02',
      }),
    );
  });
});
