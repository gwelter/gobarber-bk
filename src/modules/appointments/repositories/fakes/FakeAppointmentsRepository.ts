import { uuid } from 'uuidv4';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmenDTO from '@modules/appointments/dtos/ICreateAppointmenDTO';

import Appointment from '../../infra/typeorm/entities/Appointment';

export default class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async create({ provider_id, date }: ICreateAppointmenDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), date, provider_id });

    this.appointments.push(appointment);
    return appointment;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    return this.appointments.find(appointment => appointment.date === date);
  }
}
