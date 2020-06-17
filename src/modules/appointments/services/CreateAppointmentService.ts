import { startOfHour, isBefore, getHours } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
export default class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({ provider_id, user_id, date }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (provider_id === user_id) {
      throw new AppError("You can't creante an appoinment with yourself");
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError("You can't creante an appoinment before 8am or after 5pm");
    }

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't creante an appoinment on a past date");
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(appointmentDate);
    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    return appointment;
  }
}
