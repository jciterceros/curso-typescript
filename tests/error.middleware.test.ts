import { describe, expect, it, vi } from "vitest";
import errorMiddleware from "../src/middlewares/error.middleware.js";
import { ValidationError } from "../src/errors/app-error.js";
import { ERROR_CODES } from "../src/constants/error-codes.js";
import logger from "../src/utils/logger.js";

const mockEnv = vi.hoisted(() => ({
  NODE_ENV: "test" as "development" | "production" | "test",
  PORT: 3000,
  LOG_LEVEL: "info" as "debug" | "info" | "warn" | "error",
}));

vi.mock("../src/config/env.js", () => ({ env: mockEnv }));

describe("error middleware", () => {
  it("retorna 500 com payload padrao para Error", () => {
    const json = vi.fn();
    const req = {
      method: "GET",
      originalUrl: "/users",
    };
    const res = {
      locals: { requestId: "req-500" },
      status: vi.fn(() => ({ json })),
    };
    const loggerError = vi.spyOn(logger, "error").mockImplementation(() => logger as never);

    errorMiddleware(new Error("falha inesperada"), req as never, res as never, vi.fn());

    expect(loggerError).toHaveBeenCalled();
    expect(loggerError).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "http_error",
        errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
        requestId: "req-500",
        method: "GET",
        path: "/users",
        internalMessage: "falha inesperada",
      }),
      "http_error",
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: {
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
        details: { internalMessage: "falha inesperada" },
      },
    });

    loggerError.mockRestore();
  });

  it("converte valores nao-Error para string no payload 500", () => {
    const json = vi.fn();
    const res = {
      status: vi.fn(() => ({ json })),
    };
    const loggerError = vi.spyOn(logger, "error").mockImplementation(() => logger as never);

    errorMiddleware("falha crua", {} as never, res as never, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: {
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
        details: { internalMessage: "falha crua" },
      },
    });

    loggerError.mockRestore();
  });

  it("nao expõe detalhes internos no payload 500 em producao", () => {
    mockEnv.NODE_ENV = "production";

    const json = vi.fn();
    const res = {
      status: vi.fn(() => ({ json })),
    };
    const loggerError = vi.spyOn(logger, "error").mockImplementation(() => logger as never);

    errorMiddleware(
      new Error("falha inesperada com detalhe interno"),
      {} as never,
      res as never,
      vi.fn(),
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: {
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      },
    });

    loggerError.mockRestore();
    mockEnv.NODE_ENV = "test";
  });

  it("mapeia ValidationError para 400 sem cair no fallback 500", () => {
    const json = vi.fn();
    const res = {
      status: vi.fn(() => ({ json })),
    };
    const loggerError = vi.spyOn(logger, "error").mockImplementation(() => logger as never);

    const error = new ValidationError("Invalid request", {
      fieldErrors: { status: ["Invalid enum value"] },
    });
    errorMiddleware(error, {} as never, res as never, vi.fn());

    expect(loggerError).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      error: {
        code: ERROR_CODES.INVALID_REQUEST,
        message: "Invalid request",
        details: { fieldErrors: { status: ["Invalid enum value"] } },
      },
    });

    loggerError.mockRestore();
  });
});
