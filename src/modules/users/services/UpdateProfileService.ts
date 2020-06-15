import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  oldPassword?: string;
}

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ user_id, name, email, password, oldPassword }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found');
    }

    const userWithTakenEmail = await this.usersRepository.findByEmail(email);
    if (userWithTakenEmail && userWithTakenEmail.id !== user.id) {
      throw new AppError('Email already taken');
    }

    if (password && !oldPassword) {
      throw new AppError('You need to inform the current password to set a new one');
    }
    if (password && oldPassword) {
      const isValidOldPassowrd = await this.hashProvider.compareHash(oldPassword, user.password);
      if (!isValidOldPassowrd) {
        throw new AppError('Invalid old password');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    user.name = name;
    user.email = email;

    return this.usersRepository.save(user);
  }
}
