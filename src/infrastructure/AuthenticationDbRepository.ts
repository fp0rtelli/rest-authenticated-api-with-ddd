import { AuthenticationRepository, User, UserEntity } from '../domain/AuthenticationService';

export default class AuthenticationDbRepository implements AuthenticationRepository {
  get(user: User): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }
  create(user: User): Promise<void> {
    throw new Error('Method not implemented.');
  }
  find(filter: { password?: string; email?: string; }): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }
}