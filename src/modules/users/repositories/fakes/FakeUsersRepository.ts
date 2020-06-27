import { uuid } from 'uuidv4';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

import User from '../../infra/typeorm/entities/User';

export default class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findAllProviders({ exceptUserId }: IFindAllProvidersDTO): Promise<User[]> {
    let { users } = this;

    if (exceptUserId) {
      users = this.users.filter(user => user.id !== exceptUserId);
    }
    return [...users];
  }

  public async findById(id: string): Promise<User | undefined> {
    const foundUser = this.users.find(user => user.id === id);
    return foundUser ? { ...foundUser, getAvatarUrl: (): string | null => '' } : undefined;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const foundUser = this.users.find(user => user.email === email);
    return foundUser ? { ...foundUser, getAvatarUrl: (): string | null => '' } : undefined;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, { id: uuid(), getAvatarUrl: '' }, userData);

    this.users.push(user);
    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;
    return user;
  }
}
