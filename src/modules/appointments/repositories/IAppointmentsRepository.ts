import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmenDTO from '../dtos/ICreateAppointmenDTO';
import IFindAllInMonthFromProviderDTO from '../dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '../dtos/IFindAllInDayFromProviderDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmenDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  findAllInMonthFromProvider({ provider_id }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]>;
  findAllInDayFromProvider({ provider_id }: IFindAllInDayFromProviderDTO): Promise<Appointment[]>;
}
