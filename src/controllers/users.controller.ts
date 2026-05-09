import type { Request, Response } from "express";
import usersService from "../services/users.service.js";

class UsersController {
  index(_req: Request, res: Response) {
    const users = usersService.findAll();
    res.json(users);
  }
}

export default new UsersController();
