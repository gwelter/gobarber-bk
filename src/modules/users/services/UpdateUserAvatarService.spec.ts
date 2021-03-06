import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatarService: UpdateUserAvatarService;

describe('UpdateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatarService = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);
  });

  it('should be able to update an avatar of an existing user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jon Doe',
      email: 'jon.doe@test.com',
      password: '123456',
    });

    const updatedUser = await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpeg',
    });

    expect(updatedUser.id).toBe(user.id);
    expect(updatedUser.avatar).toBe('avatar.jpeg');
  });

  it('should not be able to update an avatar of a non existing user', async () => {
    const response = updateUserAvatarService.execute({
      user_id: '123456',
      avatarFileName: 'avatar.jpeg',
    });

    await expect(response).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating to a new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'Jon Doe',
      email: 'jon.doe@test.com',
      password: '123456',
    });

    let updatedUser = await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpeg',
    });

    updatedUser = await updateUserAvatarService.execute({
      user_id: updatedUser.id,
      avatarFileName: 'avatar_new.jpeg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpeg');
    expect(updatedUser.id).toBe(user.id);
    expect(updatedUser.avatar).toBe('avatar_new.jpeg');
  });
});
