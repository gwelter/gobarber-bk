import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmenDTO from '../dtos/ICreateAppointmenDTO';
import IFindAllInMonthFromProviderDTO from '../dtos/IFindAllInMonthFromProviderDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmenDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  findAllInMonthFromProvider({ provider_id }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]>;
}
