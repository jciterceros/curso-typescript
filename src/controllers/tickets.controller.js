import ticketsService from '../services/tickets.service.js';

class TicketsController {
  index(req, res) {
    const result = ticketsService.listTickets(req.query);
    res.json(result);
  }

  show(req, res) {
    const ticket = ticketsService.getTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(ticket);
  }

  summary(req, res) {
    const summary = ticketsService.getTicketSummary(req.params.id);
    if (!summary) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(summary);
  }

  store(req, res) {
    try {
      const result = ticketsService.createTicket(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  update(req, res) {
    const ticket = ticketsService.updateTicket(req.params.id, req.body);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(ticket);
  }

  addComment(req, res) {
    try {
      const comment = ticketsService.addComment(req.params.id, req.body);
      res.status(201).json(comment);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

export default new TicketsController();
