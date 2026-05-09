import { generateId } from "../utils/id.js";
import type { Comment, CreateCommentDto } from "../domain/comment.js";

export interface ICommentsRepository {
  findByTicketId(ticketId: string): Comment[];
  create(data: CreateCommentDto): Comment;
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

class CommentsRepository implements ICommentsRepository {
  findByTicketId(ticketId: string): Comment[] {
    return comments.filter((c) => c.ticketId === ticketId).map(cloneComment);
  }

  create(data: CreateCommentDto): Comment {
    const newComment: Comment = {
      id: generateId(),
      ...data,
      createdAt: new Date(),
    };
    comments.push(newComment);
    return cloneComment(newComment);
  }
}

const commentsRepository: ICommentsRepository = new CommentsRepository();

export default commentsRepository;
