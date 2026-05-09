import request from "supertest";
import app from "../src/app.ts";
import { resetCommentsRepository } from "../src/repositories/comments.repository.ts";
import { resetTicketsRepository } from "../src/repositories/tickets.repository.ts";
import { ERROR_CODES } from "../src/constants/error-codes.ts";

describe("Helpdesk API - contrato final da migracao", () => {
  let api;

  beforeEach(() => {
    resetTicketsRepository();
    resetCommentsRepository();
    api = request(app);
  });

  it("lista tickets com contrato consistente e prioridades numericas", async () => {
    const response = await api.get("/tickets").query({ limit: 10, page: 1 }).expect(200);

    expect(response.body).toEqual({
      data: expect.any(Array),
      total: expect.any(Number),
    });

    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "t1",
          status: "open",
          priority: expect.any(Number),
        }),
      ]),
    );

    for (const ticket of response.body.data) {
      expect(typeof ticket.priority).toBe("number");
    }
  });

  it("filtra tickets usando query params convertidos e validados", async () => {
    const response = await api
      .get("/tickets")
      .query({ priority: "3", limit: "5", page: "1" })
      .expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toMatchObject({
      id: "t2",
      priority: 3,
    });
  });

  it("filtra tickets por status valido", async () => {
    const response = await api.get("/tickets").query({ status: "open" }).expect(200);

    expect(response.body.data.length).toBeGreaterThan(0);

    for (const ticket of response.body.data) {
      expect(ticket.status).toBe("open");
    }
  });

  it("rejeita query params invalidos", async () => {
    const response = await api
      .get("/tickets")
      .query({ status: "closedd", priority: "alta", limit: "0", page: "-1" })
      .expect(400);

    expect(response.body).toEqual(
      expect.objectContaining({
        code: ERROR_CODES.INVALID_REQUEST,
        error: "Invalid request",
      }),
    );
  });

  it("rejeita query param de prioridade vazio", async () => {
    const response = await api.get("/tickets").query({ priority: "" }).expect(400);

    expect(response.body).toEqual(
      expect.objectContaining({
        code: ERROR_CODES.INVALID_REQUEST,
        error: "Invalid request",
      }),
    );
  });

  it("retorna detalhes do ticket com comentarios e trata 404", async () => {
    const response = await api.get("/tickets/t1").expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: "t1",
        description: expect.any(String),
        comments: expect.any(Array),
      }),
    );

    const notFoundResponse = await api.get("/tickets/ticket-inexistente").expect(404);
    expect(notFoundResponse.body).toEqual({
      code: ERROR_CODES.TICKET_NOT_FOUND,
      error: "Ticket not found",
    });
  });

  it("retorna resumo usando description em vez de uma propriedade inexistente", async () => {
    const response = await api.get("/tickets/t1/summary").expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        title: "Erro no login",
        short_desc: expect.any(String),
        assigned_to: "u1",
        created: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
      }),
    );
    expect(response.body.short_desc).toBeTruthy();
  });

  it("retorna 404 ao buscar resumo de ticket inexistente", async () => {
    const response = await api.get("/tickets/ticket-inexistente/summary").expect(404);

    expect(response.body).toEqual({
      code: ERROR_CODES.TICKET_NOT_FOUND,
      error: "Ticket not found",
    });
  });

  it("cria ticket valido e converte priority para number", async () => {
    const response = await api
      .post("/tickets")
      .send({
        title: "Erro no login",
        description: "Usuario nao consegue acessar o sistema",
        status: "open",
        priority: "2",
        assigneeId: "u1",
      })
      .expect(201);

    expect(response.body.ticket).toEqual(
      expect.objectContaining({
        title: "Erro no login",
        description: "Usuario nao consegue acessar o sistema",
        status: "open",
        priority: 2,
        assigneeId: "u1",
      }),
    );

    const listResponse = await api.get("/tickets").query({ limit: 50, page: 1 }).expect(200);

    expect(listResponse.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: response.body.ticket.id,
          title: "Erro no login",
          priority: 2,
        }),
      ]),
    );
  });

  it("rejeita payload invalido na criacao de ticket", async () => {
    const response = await api
      .post("/tickets")
      .send({
        title: "Oi",
        description: "x",
        status: "closedd",
        priority: "alta",
      })
      .expect(400);

    expect(response.body).toEqual(
      expect.objectContaining({
        code: ERROR_CODES.INVALID_REQUEST,
        error: "Invalid request",
      }),
    );
  });

  it("atualiza apenas campos permitidos no PATCH", async () => {
    const before = await api.get("/tickets/t1").expect(200);

    const response = await api
      .patch("/tickets/t1")
      .send({
        status: "closed",
        priority: "4",
        createdAt: "1990-01-01T00:00:00.000Z",
        extra_field: "isso nao deveria estar aqui",
      })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: "t1",
        status: "closed",
        priority: 4,
      }),
    );
    expect(response.body.createdAt).toBe(before.body.createdAt);
    expect(response.body).not.toHaveProperty("extra_field");
  });

  it("rejeita PATCH com campos invalidos", async () => {
    const response = await api
      .patch("/tickets/t1")
      .send({
        status: "closedd",
        priority: "alta",
      })
      .expect(400);

    expect(response.body).toEqual(
      expect.objectContaining({
        code: ERROR_CODES.INVALID_REQUEST,
        error: "Invalid request",
      }),
    );
  });

  it("rejeita PATCH com body vazio", async () => {
    const response = await api.patch("/tickets/t1").send({}).expect(400);

    expect(response.body).toEqual(
      expect.objectContaining({
        code: ERROR_CODES.INVALID_REQUEST,
        error: "Invalid request",
      }),
    );
  });

  it("retorna 404 ao atualizar ticket inexistente", async () => {
    const response = await api
      .patch("/tickets/ticket-inexistente")
      .send({ status: "closed" })
      .expect(404);

    expect(response.body).toEqual({
      code: ERROR_CODES.TICKET_NOT_FOUND,
      error: "Ticket not found",
    });
  });

  it("adiciona comentario em ticket existente e retorna 404 para ticket ausente", async () => {
    const response = await api
      .post("/tickets/t1/comments")
      .send({
        authorId: "u2",
        message: "Estamos analisando o problema.",
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        ticketId: "t1",
        authorId: "u2",
        message: "Estamos analisando o problema.",
      }),
    );

    const notFoundResponse = await api
      .post("/tickets/ticket-inexistente/comments")
      .send({
        authorId: "u2",
        message: "Nao deve ser criado.",
      })
      .expect(404);

    expect(notFoundResponse.body).toEqual({
      code: ERROR_CODES.TICKET_NOT_FOUND,
      error: "Ticket not found",
    });

    const ticketResponse = await api.get("/tickets/t1").expect(200);

    expect(ticketResponse.body.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: response.body.id,
          ticketId: "t1",
          authorId: "u2",
          message: "Estamos analisando o problema.",
        }),
      ]),
    );
  });

  it("rejeita comentario com payload invalido", async () => {
    const response = await api
      .post("/tickets/t1/comments")
      .send({
        authorId: "",
        message: "",
      })
      .expect(400);

    expect(response.body).toEqual(
      expect.objectContaining({
        code: ERROR_CODES.INVALID_REQUEST,
        error: "Invalid request",
      }),
    );
  });

  it("lista usuarios cadastrados", async () => {
    const response = await api.get("/users").expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "u1",
          name: expect.any(String),
          email: expect.any(String),
        }),
      ]),
    );
  });
});
