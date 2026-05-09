import ticketsRepository from '../repositories/tickets.repository.js';
import commentsRepository from '../repositories/comments.repository.js';
import { CreateTicketDto, TicketStatus, UpdateTicketDto } from '../domain/ticket.js';
import { NotFoundError } from '../errors/app-error.js';
import { ERROR_MESSAGES } from '../constants/error-messages.js';

type ListTicketsFilters = {
  status?: TicketStatus;
  priority?: number;
  limit?: number;
  page?: number;
};

type CreateCommentDto = {
  authorId: string;
  message: string;
};

class TicketsService {
  listTickets(filters: ListTicketsFilters) {
    const { status, priority, limit = 10, page = 1 } = filters;
    let tickets = ticketsRepository.findAll();

    if (status) {
      tickets = tickets.filter(t => t.status === status);
    }

    if (priority !== undefined) {
      tickets = tickets.filter(t => t.priority === priority);
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: tickets.slice(start, end),
      total: tickets.length
    };
  }

  getTicketById(id: string) {
    const ticket = ticketsRepository.findById(id);
    if (!ticket) return null;

    const comments = commentsRepository.findByTicketId(id);
    
    return {
      ...ticket,
      comments
    };
  }

  getTicketSummary(id: string) {
    const ticket = ticketsRepository.findById(id);
    if (!ticket) return null;

    return {
      title: ticket.title,
      short_desc: ticket.description,
      assigned_to: ticket.assigneeId,
      created: ticket.createdAt.toISOString()
    };
  }

  createTicket(ticketData: CreateTicketDto) {
    const ticket = ticketsRepository.create(ticketData);
    
    return { ticket };
  }

  updateTicket(id: string, updateData: UpdateTicketDto) {
    const ticket = ticketsRepository.update(id, updateData);
    return ticket;
  }

  addComment(ticketId: string, commentData: CreateCommentDto) {
    const ticket = ticketsRepository.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError(ERROR_MESSAGES.TICKET_NOT_FOUND);
    }

    return commentsRepository.create({
      ticketId,
      ...commentData
    });
  }
}

export default new TicketsService();
