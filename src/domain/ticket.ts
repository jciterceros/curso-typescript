export type TicketStatus = "open" | "closed" | "in_progress";
export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: number; // 1 (highest) to 5 (lowest)
  assigneeId?: string; // Optional field for the user assigned to the ticket
  createdAt: Date;
  updatedAt: Date;
}

export type CreateTicketDto = Omit<Ticket, "id" | "createdAt" | "updatedAt">;
export type UpdateTicketDto = Partial<
  Pick<Ticket, "title" | "description" | "status" | "priority" | "assigneeId">
>;
