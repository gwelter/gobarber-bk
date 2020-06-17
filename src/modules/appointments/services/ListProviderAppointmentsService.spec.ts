// import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailabilityService: ListProviderAppointmentsService;

describe('ListProviderAppointmentsService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailabilityService = new ListProviderAppointmentsService(fakeAppointmentsRepository);
  });

  it('should be able to list the appointments on a specific day from provider', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 2, 14, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 2, 15, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2020, 4, 2, 11, 0, 0).getTime());

    const appointments = await listProviderDayAvailabilityService.execute({
      provider_id: 'provider_id',
      day: 2,
      month: 5,
      year: 2020,
    });

    expect(appointments).toEqual(expect.arrayContaining([appointment1, appointment2]));
  });
});
