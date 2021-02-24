import { v4 as uuidv4 } from "uuid";

export interface IAuthenticationService {
  checkUser(user: User): Promise<void>;
  addUser(user: User): Promise<void>;
  getPassword(email: string): Promise<string>;
}

export class AuthenticationService implements IAuthenticationService {
  constructor(private readonly authenticationRepository: AuthenticationRepository) {}

  async checkUser(user: User): Promise<void> {
    const userEntity = await this.authenticationRepository.get(user);
    if (!userEntity) throw new Error(`Unable to authenticate user ${user.email}`);
  }

  async addUser(user: User): Promise<void> {
    const userEntity = { ...user, id: uuidv4() };
    await this.authenticationRepository.create(userEntity);
  }

  async getPassword(email: string): Promise<string> {
    const userEntity = await this.authenticationRepository.find({ email });
    if (!userEntity) throw new Error(`Unable to find user with email ${email}`);
    return userEntity.password;
  }
}

export interface AuthenticationRepository {
  get(user: User): Promise<UserEntity|null>;
  create(user: User): Promise<void>;
  find(filter: { password?: string, email?: string }): Promise<UserEntity|null>;
}

export interface User {
  email: string,
  password: string
}

export interface UserEntity extends User {
  id: string
}
