import type { Request, Response } from "express";
import usersRepository from "../repositories/users.repository.js";

class UsersController {
  index(_req: Request, res: Response) {
    const users = usersRepository.findAll();
    res.json(users);
  }
}

export default new UsersController();
