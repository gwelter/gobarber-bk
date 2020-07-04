// import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(fakeAppointmentsRepository);
  });

  it('should be able to list the month availability from provider', async () => {
    const workingHours = Array.from({ length: 10 }, (_, index) => index + 8);
    jest.spyOn(Date, 'now').mockImplementation(() => new Date(2020, 4, 20, 11, 0, 0).getTime());

    Promise.all(
      workingHours.map(workingHour =>
        fakeAppointmentsRepository.create({
          provider_id: 'provider_id',
          user_id: 'user_id',
          date: new Date(2020, 4, 20, workingHour, 0, 0),
        }),
      ),
    );

    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 21, 10, 0, 0),
    });

    const providerAvaliability = await listProviderMonthAvailabilityService.execute({
      provider_id: 'provider_id',
      year: 2020,
      month: 5,
    });

    expect(providerAvaliability).toEqual(
      expect.arrayContaining([
        { day: 19, available: false }, // past date
        { day: 20, available: false }, // all booked
        { day: 21, available: true },
      ]),
    );
  });
});
