import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let authenticateUserService: AuthenticateUserService;

describe('AutenticateUser', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    authenticateUserService = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to autenticate with an existing user', async () => {
    const user = await fakeUsersRepository.create({
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
    await fakeUsersRepository.create({
      name: 'Jon Doe',
      email: 'jon.doe@test.com',
      password: '123456',
    });

    const response = authenticateUserService.execute({
      email: 'jon.doe@test.com',
      password: 'aaaaaa',
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to autenticate with an unexisting user', async () => {
    const response = authenticateUserService.execute({
      email: 'noone@test.com',
      password: '123456',
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
  });
});
