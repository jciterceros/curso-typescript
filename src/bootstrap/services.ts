import ticketsRepository from "../repositories/tickets.repository.js";
import commentsRepository from "../repositories/comments.repository.js";
import usersRepository from "../repositories/users.repository.js";
import { TicketsService } from "../services/tickets.service.js";
import { UsersService } from "../services/users.service.js";

export const ticketsService = new TicketsService({
  ticketsRepository,
  commentsRepository,
  usersRepository,
});

export const usersService = new UsersService(usersRepository);
