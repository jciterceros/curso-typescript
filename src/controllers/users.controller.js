import usersRepository from '../repositories/users.repository.js';

class UsersController {
  index(req, res) {
    const users = usersRepository.findAll();
    res.json(users);
  }
}

export default new UsersController();
