import { CreateTicketDto, Ticket, UpdateTicketDto } from '../domain/ticket.js';
import { generateId } from '../utils/id.js';

const initialTickets: Ticket[] = [
  {
    id: 't1',
    title: 'Erro no login',
    description: 'Não consigo acessar o sistema com minha senha.',
    status: 'open',
    priority: 5,
    assigneeId: 'u1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 't2',
    title: 'Impressora offline',
    description: 'A impressora do setor financeiro não responde.',
    status: 'in_progress',
    priority: 3,
    assigneeId: 'u2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const cloneTicket = (ticket: Ticket): Ticket => ({
  ...ticket,
  createdAt: new Date(ticket.createdAt),
  updatedAt: new Date(ticket.updatedAt),
});

const tickets: Ticket[] = initialTickets.map(cloneTicket);

export function resetTicketsRepository(): void {
  tickets.length = 0;
  tickets.push(...initialTickets.map(cloneTicket));
}

class TicketsRepository {
  findAll(): Ticket[] {
    return tickets;
  }

  findById(id: string): Ticket | null {
    const ticket = tickets.find(t => t.id === id);
    return ticket || null;
  }

  create(data: CreateTicketDto): Ticket {
    const newTicket = {
      id: generateId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    tickets.push(newTicket);
    return newTicket;
  }

  update(id: string, data: UpdateTicketDto): Ticket | null {
    const index = tickets.findIndex(t => t.id === id);
    if (index === -1) return null;

    const updatedTicket = Object.assign(tickets[index], data, { updatedAt: new Date() });
    tickets[index] = updatedTicket;
    return updatedTicket;
  }
}

export default new TicketsRepository();
