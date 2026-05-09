import { CreateTicketDto, TicketStatus, UpdateTicketDto } from "../domain/ticket.js";
import type { CreateCommentDto } from "../domain/comment.js";
import type { ITicketsRepository } from "../repositories/tickets.repository.js";
import type { ICommentsRepository } from "../repositories/comments.repository.js";
import type { IUsersRepository } from "../repositories/users.repository.js";
import { ValidationError } from "../errors/app-error.js";
import { ERROR_CODES } from "../constants/error-codes.js";
import { ERROR_MESSAGES } from "../constants/error-messages.js";

type ListTicketsFilters = {
  status?: TicketStatus;
  priority?: number;
  limit?: number;
  page?: number;
};

type AddCommentInput = Omit<CreateCommentDto, "ticketId">;

export type TicketsServiceDeps = {
  ticketsRepository: ITicketsRepository;
  commentsRepository: ICommentsRepository;
  usersRepository: IUsersRepository;
};

export class TicketsService {
  constructor(private readonly deps: TicketsServiceDeps) {}

  private validateAssigneeExists(assigneeId: string | undefined): void {
    if (!assigneeId) return;
    const user = this.deps.usersRepository.findById(assigneeId);
    if (!user) {
      throw new ValidationError(
        ERROR_MESSAGES.INVALID_REQUEST,
        { assigneeId: "Assignee not found" },
        ERROR_CODES.INVALID_REQUEST,
      );
    }
  }

  listTickets(filters: ListTicketsFilters) {
    const { status, priority, limit = 10, page = 1 } = filters;
    let tickets = this.deps.ticketsRepository.findAll();

    if (status) {
      tickets = tickets.filter((t) => t.status === status);
    }

    if (priority !== undefined) {
      tickets = tickets.filter((t) => t.priority === priority);
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const total = tickets.length;
    const totalPages = Math.ceil(total / limit);

    return {
      data: tickets.slice(start, end),
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  getTicketById(id: string) {
    const ticket = this.deps.ticketsRepository.findById(id);
    if (!ticket) return null;

    const comments = this.deps.commentsRepository.findByTicketId(id);

    return {
      ...ticket,
      comments,
    };
  }

  getTicketSummary(id: string) {
    const ticket = this.deps.ticketsRepository.findById(id);
    if (!ticket) return null;

    return {
      title: ticket.title,
      shortDesc: ticket.description,
      assignedTo: ticket.assigneeId,
      created: ticket.createdAt.toISOString(),
    };
  }

  createTicket(ticketData: CreateTicketDto) {
    this.validateAssigneeExists(ticketData.assigneeId);
    const ticket = this.deps.ticketsRepository.create(ticketData);
    return ticket;
  }

  updateTicket(id: string, updateData: UpdateTicketDto) {
    this.validateAssigneeExists(updateData.assigneeId);
    const ticket = this.deps.ticketsRepository.update(id, updateData);
    return ticket;
  }

  addComment(ticketId: string, commentData: AddCommentInput) {
    const ticket = this.deps.ticketsRepository.findById(ticketId);
    if (!ticket) return null;

    return this.deps.commentsRepository.create({
      ticketId,
      ...commentData,
    });
  }
}
