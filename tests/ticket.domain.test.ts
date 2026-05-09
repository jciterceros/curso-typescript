import { describe, expect, it } from 'vitest';
import type { CreateTicketDto, Ticket, TicketStatus, UpdateTicketDto } from '../src/domain/ticket.js';

const validStatuses: TicketStatus[] = ['open', 'closed', 'in_progress'];

function isTicketStatus(value: string): value is TicketStatus {
  return validStatuses.includes(value as TicketStatus);
}

function assertTicketContract(ticket: Ticket) {
  expect(typeof ticket.id).toBe('string');
  expect(typeof ticket.title).toBe('string');
  expect(typeof ticket.description).toBe('string');
  expect(validStatuses).toContain(ticket.status);
  expect(typeof ticket.priority).toBe('number');
  expect(ticket.createdAt).toBeInstanceOf(Date);
  expect(ticket.updatedAt).toBeInstanceOf(Date);
}

describe('ticket domain contract', () => {
  it('aceita somente status validos', () => {
    expect(isTicketStatus('open')).toBe(true);
    expect(isTicketStatus('closed')).toBe(true);
    expect(isTicketStatus('in_progress')).toBe(true);
    expect(isTicketStatus('pending')).toBe(false);
  });

  it('valida o contrato de um Ticket completo', () => {
    const ticket: Ticket = {
      id: 't100',
      title: 'Falha no backup',
      description: 'Rotina de backup noturno falhou',
      status: 'open',
      priority: 2,
      assigneeId: 'u1',
      createdAt: new Date('2026-05-09T00:00:00.000Z'),
      updatedAt: new Date('2026-05-09T00:00:00.000Z'),
    };

    assertTicketContract(ticket);
  });

  it('CreateTicketDto contem apenas campos de criacao', () => {
    const createTicketDto: CreateTicketDto = {
      title: 'Erro no pagamento',
      description: 'Gateway retornando timeout',
      status: 'in_progress',
      priority: 3,
      assigneeId: 'u2',
    };

    expect(createTicketDto).toEqual(
      expect.objectContaining({
        title: expect.any(String),
        description: expect.any(String),
        status: expect.any(String),
        priority: expect.any(Number),
      }),
    );
    expect('id' in createTicketDto).toBe(false);
    expect('createdAt' in createTicketDto).toBe(false);
    expect('updatedAt' in createTicketDto).toBe(false);
  });

  it('UpdateTicketDto permite atualizacao parcial', () => {
    const updateStatusOnly: UpdateTicketDto = {
      status: 'closed',
    };

    const updateMultipleFields: UpdateTicketDto = {
      title: 'Titulo atualizado',
      description: 'Descricao atualizada',
      priority: 1,
      assigneeId: 'u3',
    };

    expect(updateStatusOnly).toEqual({ status: 'closed' });
    expect(updateMultipleFields).toEqual(
      expect.objectContaining({
        title: 'Titulo atualizado',
        description: 'Descricao atualizada',
        priority: 1,
        assigneeId: 'u3',
      }),
    );
  });
});
