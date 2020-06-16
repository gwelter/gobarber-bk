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

  it('should be able to list all providers', async () => {
    const MAY = 5;
    const workingHours = Array.from({ length: 10 }, (_, index) => index + 8);
    Promise.all(
      workingHours.map(workingHour =>
        fakeAppointmentsRepository.create({
          provider_id: 'provider_id',
          date: new Date(2020, MAY - 1, 20, workingHour, 0, 0),
        }),
      ),
    );

    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      date: new Date(2020, MAY - 1, 21, 10, 0, 0),
    });

    const providerAvaliability = await listProviderMonthAvailabilityService.execute({
      provider_id: 'provider_id',
      year: 2020,
      month: MAY,
    });

    expect(providerAvaliability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
      ]),
    );
  });
});
