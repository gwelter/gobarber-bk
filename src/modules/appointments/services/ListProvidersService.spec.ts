// import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProvidersService = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list all providers', async () => {
    const loggedUser = await fakeUsersRepository.create({
      name: 'Jon Doe',
      email: 'jon.doe@test.com',
      password: '123456',
    });

    const tre = await fakeUsersRepository.create({
      name: 'Jon Tre',
      email: 'jon.tre@test.com',
      password: '123456',
    });

    const qua = await fakeUsersRepository.create({
      name: 'Jon Qua',
      email: 'jon.qua@test.com',
      password: '123456',
    });

    const users = await listProvidersService.execute({ user_id: loggedUser.id });

    expect(users).toEqual([tre, qua]);
  });
});
