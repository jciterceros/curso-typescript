import type { Request, Response } from "express";
import { usersService } from "../bootstrap/services.js";
import { asyncHandler } from "../utils/async-handler.js";

class UsersController {
  index(_req: Request, res: Response) {
    const users = usersService.findAll();
    res.json({ data: users });
  }
}

const usersController = new UsersController();

export default {
  index: asyncHandler(usersController.index.bind(usersController)),
};
