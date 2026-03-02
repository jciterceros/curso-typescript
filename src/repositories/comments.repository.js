const { generateId } = require('../utils/id');

const comments = [
  {
    id: 'c1',
    ticketId: 't1',
    authorId: 'u2',
    message: 'Já estamos verificando o servidor de autenticação.',
    createdAt: new Date(),
  }
];

class CommentsRepository {
  findByTicketId(ticketId) {
    return comments.filter(c => c.ticketId === ticketId);
  }

  create(data) {
    const newComment = {
      id: generateId(),
      ...data,
      createdAt: new Date(),
    };
    comments.push(newComment);
    return newComment;
  }
}

module.exports = new CommentsRepository();
