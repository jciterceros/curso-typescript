import type { Request, Response } from "express";
import { z } from "zod";
import ticketsService from "../services/tickets.service.js";
import { NotFoundError, ValidationError } from "../errors/app-error.js";
import { ERROR_MESSAGES } from "../constants/error-messages.js";

const statusSchema = z.enum(["open", "closed", "in_progress"]);

const numberFromInputSchema = (min: number, max: number) =>
  z.preprocess(
    (value) => {
      if (value === undefined) return undefined;
      if (typeof value === "string" && value.trim() === "") return Number.NaN;
      return Number(value);
    },
    z.number().int().min(min).max(max),
  );

const listTicketsQuerySchema = z.object({
  status: statusSchema.optional(),
  priority: numberFromInputSchema(1, 5).optional(),
  limit: numberFromInputSchema(1, Number.MAX_SAFE_INTEGER).optional(),
  page: numberFromInputSchema(1, Number.MAX_SAFE_INTEGER).optional(),
});

const createTicketSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  status: statusSchema,
  priority: numberFromInputSchema(1, 5),
  assigneeId: z.string().min(1).optional(),
});

const updateTicketSchema = z
  .object({
    title: z.string().min(3).optional(),
    description: z.string().min(3).optional(),
    status: statusSchema.optional(),
    priority: numberFromInputSchema(1, 5).optional(),
    assigneeId: z.string().min(1).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one valid field is required",
  });

const addCommentSchema = z.object({
  authorId: z.string().min(1),
  message: z.string().min(1),
});

const parseOrThrow = <T>(schema: z.ZodType<T>, input: unknown): T => {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    throw new ValidationError(ERROR_MESSAGES.INVALID_REQUEST, { issues: parsed.error.issues });
  }
  return parsed.data;
};

class TicketsController {
  index(req: Request, res: Response) {
    const filters = parseOrThrow(listTicketsQuerySchema, req.query);
    const result = ticketsService.listTickets(filters);
    res.json(result);
  }

  show(req: Request<{ id: string }>, res: Response) {
    const ticket = ticketsService.getTicketById(req.params.id);
    if (!ticket) {
      throw new NotFoundError(ERROR_MESSAGES.TICKET_NOT_FOUND);
    }
    res.json(ticket);
  }

  summary(req: Request<{ id: string }>, res: Response) {
    const summary = ticketsService.getTicketSummary(req.params.id);
    if (!summary) {
      throw new NotFoundError(ERROR_MESSAGES.TICKET_NOT_FOUND);
    }
    res.json(summary);
  }

  store(req: Request, res: Response) {
    const ticketData = parseOrThrow(createTicketSchema, req.body);
    const result = ticketsService.createTicket(ticketData);
    res.status(201).json(result);
  }

  update(req: Request<{ id: string }>, res: Response) {
    const updateData = parseOrThrow(updateTicketSchema, req.body);
    const ticket = ticketsService.updateTicket(req.params.id, updateData);
    if (!ticket) {
      throw new NotFoundError(ERROR_MESSAGES.TICKET_NOT_FOUND);
    }
    res.json(ticket);
  }

  addComment(req: Request<{ id: string }>, res: Response) {
    const commentData = parseOrThrow(addCommentSchema, req.body);
    const comment = ticketsService.addComment(req.params.id, commentData);
    res.status(201).json(comment);
  }
}

export default new TicketsController();
