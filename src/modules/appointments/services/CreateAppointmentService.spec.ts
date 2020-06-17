import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointmentService = new CreateAppointmentService(fakeAppointmentsRepository);
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointmentService.execute({
      date: new Date(),
      user_id: 'user_id',
      provider_id: '11223344',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('11223344');
  });

  it('should not be able to create two appointment on the same time', async () => {
    const appointmentDate = new Date(2020, 4, 10, 11);

    await createAppointmentService.execute({
      date: appointmentDate,
      user_id: 'user_id',
      provider_id: '11223344',
    });

    await expect(
      createAppointmentService.execute({
        date: appointmentDate,
        user_id: 'user_id',
        provider_id: '11223344',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
