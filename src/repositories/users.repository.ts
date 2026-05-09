import type { User } from "../domain/user.js";

const users: User[] = [
  { id: "u1", name: "Alice Suporte", email: "alice@helpdesk.com" },
  { id: "u2", name: "Bob Tecnico", email: "bob@helpdesk.com" },
  { id: "u3", name: "Charlie Usuario", email: "charlie@gmail.com" },
];

class UsersRepository {
  findAll(): User[] {
    return users.map((u) => ({ ...u }));
  }

  findById(id: string): User | undefined {
    const user = users.find((u) => u.id === id);
    return user ? { ...user } : undefined;
  }
}

export default new UsersRepository();
