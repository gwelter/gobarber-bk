import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';

describe('AutenticateUser', () => {
  it('should be able to autenticate with an existing user', async () => {
    const fakeHashProvider = new FakeHashProvider();
    const fakeUsersRepository = new FakeUsersRepository();
    const createUserService = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    const authenticateUserService = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

    const user = await createUserService.execute({
      name: 'Jon Doe',
      email: 'jon.doe@test.com',
      password: '123456',
    });

    const response = await authenticateUserService.execute({
      email: 'jon.doe@test.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to autenticate with a wrong password', async () => {
    const fakeHashProvider = new FakeHashProvider();
    const fakeUsersRepository = new FakeUsersRepository();
    const createUserService = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    const authenticateUserService = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

    await createUserService.execute({
      name: 'Jon Doe',
      email: 'jon.doe@test.com',
      password: '123456',
    });

    const response = authenticateUserService.execute({
      email: 'jon.doe@test.com',
      password: 'aaaaaa',
    });

    expect(response).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to autenticate with an unexisting user', async () => {
    const fakeHashProvider = new FakeHashProvider();
    const fakeUsersRepository = new FakeUsersRepository();
    const authenticateUserService = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

    const response = authenticateUserService.execute({
      email: 'noone@test.com',
      password: '123456',
    });

    expect(response).rejects.toBeInstanceOf(AppError);
  });
});
