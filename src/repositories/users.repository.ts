interface User {
  id: string;
  name: string;
  email: string;
}

const users: User[] = [
  { id: "u1", name: "Alice Suporte", email: "alice@helpdesk.com" },
  { id: "u2", name: "Bob Tecnico", email: "bob@helpdesk.com" },
  { id: "u3", name: "Charlie Usuario", email: "charlie@gmail.com" },
];

class UsersRepository {
  findAll(): User[] {
    return users;
  }

  findById(id: string): User | undefined {
    return users.find((u) => u.id === id);
  }
}

export default new UsersRepository();
