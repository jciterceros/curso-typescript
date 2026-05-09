import usersRepository from "../repositories/users.repository.js";
import type { IUsersRepository } from "../repositories/users.repository.js";

class UsersService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  findAll() {
    return this.usersRepository.findAll();
  }
}

export default new UsersService(usersRepository);
