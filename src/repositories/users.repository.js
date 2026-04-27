const users = [
  { id: 'u1', name: 'Alice Suporte', email: 'alice@helpdesk.com' },
  { id: 'u2', name: 'Bob Tecnico', email: 'bob@helpdesk.com' },
  { id: 'u3', name: 'Charlie Usuario', email: 'charlie@gmail.com' },
];

class UsersRepository {
  findAll() {
    return users;
  }

  findById(id) {
    return users.find(u => u.id === id);
  }
}

export default new UsersRepository();
