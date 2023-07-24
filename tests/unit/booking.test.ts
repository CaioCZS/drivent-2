import bookingRepository from '@/repositories/booking-repository';
import hotelsService from '@/services/hotels-service';
import bookingService from '@/services/booking-services';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('PUT /booking', () => {
  it('shoudl throw an error when user dosent have an booking yet', async () => {
    jest.spyOn(bookingRepository, 'find').mockResolvedValueOnce(null);
    jest.spyOn(hotelsService, 'verifyRoom').mockResolvedValueOnce();
    jest.spyOn(hotelsService, 'verifyUser').mockResolvedValueOnce();

    const response = bookingService.updateBooking(1, 1, 1);

    expect(response).rejects.toEqual({
      type: 'payment_error',
      message: 'user dosent have an booking yet',
    });
  });
});
