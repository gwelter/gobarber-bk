import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmenDTO from '../dtos/ICreateAppointmenDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmenDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
}
