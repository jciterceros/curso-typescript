import { generateId } from "../utils/id.js";

interface Comment {
  id: string;
  ticketId: string;
  authorId: string;
  message: string;
  createdAt: Date;
}

interface CreateCommentDto {
  ticketId: string;
  authorId: string;
  message: string;
}

const initialComments: Comment[] = [
  {
    id: "c1",
    ticketId: "t1",
    authorId: "u2",
    message: "Já estamos verificando o servidor de autenticação.",
    createdAt: new Date(),
  },
];

const cloneComment = (comment: Comment): Comment => ({
  ...comment,
  createdAt: new Date(comment.createdAt),
});

const comments: Comment[] = initialComments.map(cloneComment);

export function resetCommentsRepository(): void {
  comments.length = 0;
  comments.push(...initialComments.map(cloneComment));
}

class CommentsRepository {
  findByTicketId(ticketId: string): Comment[] {
    return comments.filter((c) => c.ticketId === ticketId);
  }

  create(data: CreateCommentDto): Comment {
    const newComment: Comment = {
      id: generateId(),
      ...data,
      createdAt: new Date(),
    };
    comments.push(newComment);
    return newComment;
  }
}

export default new CommentsRepository();
