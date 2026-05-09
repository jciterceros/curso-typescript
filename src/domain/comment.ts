export interface Comment {
  id: string;
  ticketId: string;
  authorId: string;
  message: string;
  createdAt: Date;
}

export type CreateCommentDto = {
  ticketId: string;
  authorId: string;
  message: string;
};
