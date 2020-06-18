import { getMongoRepository, MongoRepository } from 'typeorm';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

import Notification from '../schemas/Notification';

export default class AppointmentsRepository implements INotificationsRepository {
  private odmRepository: MongoRepository<Notification>;

  constructor() {
    this.odmRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create({ content, recipient_id }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.odmRepository.create({ content, recipient_id });
    await this.odmRepository.save(notification);

    return notification;
  }
}
