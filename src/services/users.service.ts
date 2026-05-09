import type { IUsersRepository } from "../repositories/users.repository.js";

export class UsersService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  findAll() {
    return this.usersRepository.findAll();
  }
}
