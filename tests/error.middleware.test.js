import errorMiddleware from "../src/middlewares/error.middleware.ts";
import { ValidationError } from "../src/errors/app-error.ts";
import { ERROR_CODES } from "../src/constants/error-codes.ts";

describe("error middleware", () => {
  it("retorna 500 com payload padrao para Error", () => {
    const json = vi.fn();
    const res = {
      status: vi.fn(() => ({ json })),
    };
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    errorMiddleware(new Error("falha inesperada"), {}, res, vi.fn());

    expect(consoleError).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
      error: "falha inesperada",
    });

    consoleError.mockRestore();
  });

  it("converte valores nao-Error para string no payload 500", () => {
    const json = vi.fn();
    const res = {
      status: vi.fn(() => ({ json })),
    };
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    errorMiddleware("falha crua", {}, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
      error: "falha crua",
    });

    consoleError.mockRestore();
  });

  it("mapeia ValidationError para 400 sem cair no fallback 500", () => {
    const json = vi.fn();
    const res = {
      status: vi.fn(() => ({ json })),
    };
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    const error = new ValidationError("Invalid request", {
      fieldErrors: { status: ["Invalid enum value"] },
    });
    errorMiddleware(error, {}, res, vi.fn());

    expect(consoleError).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      code: ERROR_CODES.INVALID_REQUEST,
      error: "Invalid request",
      details: { fieldErrors: { status: ["Invalid enum value"] } },
    });

    consoleError.mockRestore();
  });
});
