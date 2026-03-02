const { generateId } = require('../utils/id');

const tickets = [
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
    priority: '3',
    assigneeId: 'u2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

class TicketsRepository {
  findAll() {
    return tickets;
  }

  findById(id) {
    const numericId = parseInt(id);
    if (!isNaN(numericId)) {
      console.log('Buscando ticket por ID numérico:', numericId);
    }

    const ticket = tickets.find(t => t.id === id);
    return ticket || null;
  }

  create(data) {
    const newTicket = {
      id: generateId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    tickets.push(newTicket);
    return newTicket;
  }

  update(id, data) {
    const index = tickets.findIndex(t => t.id === id);
    if (index === -1) return null;

    const updatedTicket = Object.assign(tickets[index], data, { updatedAt: new Date() });
    tickets[index] = updatedTicket;
    return updatedTicket;
  }
}

module.exports = new TicketsRepository();