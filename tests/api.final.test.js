import request from 'supertest';
import { spawn } from 'node:child_process';
import { get } from 'node:http';

let nextPort = 3100;

function waitForServer(port) {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + 5000;

    function tryRequest() {
      const req = get(`http://127.0.0.1:${port}/users`, res => {
        res.resume();
        resolve();
      });

      req.on('error', error => {
        if (Date.now() > deadline) {
          reject(error);
          return;
        }

        setTimeout(tryRequest, 50);
      });
    }

    tryRequest();
  });
}

describe('Helpdesk API - contrato final da migracao', () => {
  let api;
  let server;

  beforeEach(async () => {
    const port = nextPort++;
    server = spawn(process.execPath, ['src/app.js'], {
      env: { ...process.env, PORT: String(port) },
      stdio: 'ignore',
    });
    api = request(`http://127.0.0.1:${port}`);

    await waitForServer(port);
  });

  afterEach(() => {
    server.kill();
  });

  it('lista tickets com contrato consistente e prioridades numericas', async () => {
    const response = await api
      .get('/tickets')
      .query({ limit: 10, page: 1 })
      .expect(200);

    expect(response.body).toEqual({
      data: expect.any(Array),
      total: expect.any(Number),
    });

    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 't1',
          status: 'open',
          priority: expect.any(Number),
        }),
      ]),
    );

    for (const ticket of response.body.data) {
      expect(typeof ticket.priority).toBe('number');
    }
  });

  it('filtra tickets usando query params convertidos e validados', async () => {
    const response = await api
      .get('/tickets')
      .query({ priority: '3', limit: '5', page: '1' })
      .expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toMatchObject({
      id: 't2',
      priority: 3,
    });
  });

  it('rejeita query params invalidos', async () => {
    await api
      .get('/tickets')
      .query({ status: 'closedd', priority: 'alta', limit: '0', page: '-1' })
      .expect(400);
  });

  it('retorna detalhes do ticket com comentarios e trata 404', async () => {
    const response = await api.get('/tickets/t1').expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: 't1',
        description: expect.any(String),
        comments: expect.any(Array),
      }),
    );

    await api.get('/tickets/ticket-inexistente').expect(404);
  });

  it('retorna resumo usando description em vez de uma propriedade inexistente', async () => {
    const response = await api.get('/tickets/t1/summary').expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        title: 'Erro no login',
        short_desc: expect.any(String),
        assigned_to: 'u1',
        created: expect.any(String),
      }),
    );
    expect(response.body.short_desc).toBeTruthy();
  });

  it('cria ticket valido e converte priority para number', async () => {
    const response = await api
      .post('/tickets')
      .send({
        title: 'Erro no login',
        description: 'Usuario nao consegue acessar o sistema',
        status: 'open',
        priority: '2',
        assigneeId: 'u1',
      })
      .expect(201);

    expect(response.body.ticket).toEqual(
      expect.objectContaining({
        title: 'Erro no login',
        description: 'Usuario nao consegue acessar o sistema',
        status: 'open',
        priority: 2,
        assigneeId: 'u1',
      }),
    );
  });

  it('rejeita payload invalido na criacao de ticket', async () => {
    await api
      .post('/tickets')
      .send({
        title: 'Oi',
        description: 'x',
        status: 'closedd',
        priority: 'alta',
      })
      .expect(400);
  });

  it('atualiza apenas campos permitidos no PATCH', async () => {
    const before = await api.get('/tickets/t1').expect(200);

    const response = await api
      .patch('/tickets/t1')
      .send({
        status: 'closed',
        priority: '4',
        createdAt: '1990-01-01T00:00:00.000Z',
        extra_field: 'isso nao deveria estar aqui',
      })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: 't1',
        status: 'closed',
        priority: 4,
      }),
    );
    expect(response.body.createdAt).toBe(before.body.createdAt);
    expect(response.body).not.toHaveProperty('extra_field');
  });

  it('rejeita PATCH com campos invalidos', async () => {
    await api
      .patch('/tickets/t1')
      .send({
        status: 'closedd',
        priority: 'alta',
      })
      .expect(400);
  });

  it('adiciona comentario em ticket existente e retorna 404 para ticket ausente', async () => {
    const response = await api
      .post('/tickets/t1/comments')
      .send({
        authorId: 'u2',
        message: 'Estamos analisando o problema.',
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        ticketId: 't1',
        authorId: 'u2',
        message: 'Estamos analisando o problema.',
      }),
    );

    await api
      .post('/tickets/ticket-inexistente/comments')
      .send({
        authorId: 'u2',
        message: 'Nao deve ser criado.',
      })
      .expect(404);
  });

  it('lista usuarios cadastrados', async () => {
    const response = await api.get('/users').expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'u1',
          name: expect.any(String),
          email: expect.any(String),
        }),
      ]),
    );
  });
});
