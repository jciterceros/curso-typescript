import usersRepository from "../repositories/users.repository.js";

class UsersService {
  findAll() {
    return usersRepository.findAll();
  }
}

export default new UsersService();
