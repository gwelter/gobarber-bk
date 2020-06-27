import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let fakeUsersRepository: FakeUsersRepository;
let createUserService: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    fakeUsersRepository = new FakeUsersRepository();
    createUserService = new CreateUserService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await createUserService.execute({
      name: 'Jon Doe',
      email: 'jon.doe@test.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user same email from another', async () => {
    const email = 'jon.doe@test.com';

    await createUserService.execute({
      name: 'Jon Doe',
      email,
      password: '123456',
    });

    await expect(
      createUserService.execute({
        name: 'Jon Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
