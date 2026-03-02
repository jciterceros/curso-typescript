const usersRepository = require('../repositories/users.repository');

class UsersController {
  index(req, res) {
    const users = usersRepository.findAll();
    res.json(users);
  }
}

module.exports = new UsersController();
