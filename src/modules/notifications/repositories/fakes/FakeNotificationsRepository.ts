import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import { ObjectID } from 'mongodb';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '../../infra/typeorm/schemas/Notification';

export default class AppointmentsRepository implements INotificationsRepository {
  private notifications: Notification[];

  public async create({ content, recipient_id }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, {
      id: new ObjectID(),
      recipient_id,
      content,
    });

    return notification;
  }
}
