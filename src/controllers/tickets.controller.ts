import type { Request, Response } from "express";
import { z } from "zod";
import ticketsService from "../services/tickets.service.js";

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

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Invalid request";

class TicketsController {
  index(req: Request, res: Response) {
    try {
      const filters = listTicketsQuerySchema.parse(req.query);
      const result = ticketsService.listTickets(filters);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  show(req: Request<{ id: string }>, res: Response) {
    const ticket = ticketsService.getTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.json(ticket);
  }

  summary(req: Request<{ id: string }>, res: Response) {
    const summary = ticketsService.getTicketSummary(req.params.id);
    if (!summary) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.json(summary);
  }

  store(req: Request, res: Response) {
    try {
      const ticketData = createTicketSchema.parse(req.body);
      const result = ticketsService.createTicket(ticketData);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  update(req: Request<{ id: string }>, res: Response) {
    try {
      const updateData = updateTicketSchema.parse(req.body);
      const ticket = ticketsService.updateTicket(req.params.id, updateData);
      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      res.json(ticket);
    } catch (error) {
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  addComment(req: Request<{ id: string }>, res: Response) {
    try {
      const commentData = addCommentSchema.parse(req.body);
      const comment = ticketsService.addComment(req.params.id, commentData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof Error && error.message === "Ticket not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }
}

export default new TicketsController();
