import ticketsRepository from '../repositories/tickets.repository.js';
import commentsRepository from '../repositories/comments.repository.js';

class TicketsService {
  listTickets(filters) {
    const { status, priority, limit = 10, page = 1 } = filters;
    let tickets = ticketsRepository.findAll();

    if (status) {
      tickets = tickets.filter(t => t.status === status);
    }

    if (priority) {
      tickets = tickets.filter(t => t.priority == priority);
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: tickets.slice(start, end),
      total: tickets.length
    };
  }

  getTicketById(id) {
    const ticket = ticketsRepository.findById(id);
    if (!ticket) return null;

    const comments = commentsRepository.findByTicketId(id);
    
    return {
      ...ticket,
      comments
    };
  }

  getTicketSummary(id) {
    const ticket = ticketsRepository.findById(id);
    if (!ticket) return null;

    return {
      title: ticket.title,
      short_desc: ticket.desc,
      assigned_to: ticket.assigneeId,
      created: ticket.createdAt.toLocaleDateString()
    };
  }

  createTicket(ticketData) {
    const ticket = ticketsRepository.create(ticketData);
    
    return { ticket };
  }

  updateTicket(id, updateData) {
    const ticket = ticketsRepository.update(id, updateData);
    return ticket;
  }

  addComment(ticketId, commentData) {
    const ticket = ticketsRepository.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    return commentsRepository.create({
      ticketId,
      ...commentData
    });
  }
}

export default new TicketsService();
