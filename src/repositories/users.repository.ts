import type { User } from "../domain/user.js";

export interface IUsersRepository {
  findAll(): User[];
  findById(id: string): User | undefined;
}

const users: User[] = [
  { id: "u1", name: "Alice Suporte", email: "alice@helpdesk.com" },
  { id: "u2", name: "Bob Tecnico", email: "bob@helpdesk.com" },
  { id: "u3", name: "Charlie Usuario", email: "charlie@gmail.com" },
];

class UsersRepository implements IUsersRepository {
  findAll(): User[] {
    return users.map((u) => ({ ...u }));
  }

  findById(id: string): User | undefined {
    const user = users.find((u) => u.id === id);
    return user ? { ...user } : undefined;
  }
}

const usersRepository: IUsersRepository = new UsersRepository();

export default usersRepository;
