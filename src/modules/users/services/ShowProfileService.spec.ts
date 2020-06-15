import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show a user by id', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jon Doe',
      email: 'jon.doe@test.com',
      password: '123456',
    });

    const profile = await showProfileService.execute({
      user_id: user.id,
    });

    expect(profile.id).toBe(user.id);
    expect(profile.name).toBe('Jon Doe');
    expect(profile.email).toBe('jon.doe@test.com');
  });

  it('should be not able to show a non-existig user profile', async () => {
    await expect(
      showProfileService.execute({
        user_id: 'non-existing user id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
