import express from "express";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { asyncHandler } from "../src/utils/async-handler.js";
import errorMiddleware from "../src/middlewares/error.middleware.js";
import { ERROR_CODES } from "../src/constants/error-codes.js";
import logger from "../src/utils/logger.js";

const createTestApp = () => {
  const app = express();

  app.get(
    "/sync-error",
    asyncHandler(() => {
      throw new Error("sync failure");
    }),
  );

  app.get(
    "/async-error",
    asyncHandler(async () => {
      await Promise.resolve();
      throw new Error("async failure");
    }),
  );

  app.use(errorMiddleware);
  return app;
};

describe("asyncHandler", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("encaminha erro sincrono para o middleware global", async () => {
    const loggerError = vi.spyOn(logger, "error").mockImplementation(() => logger as never);
    const app = createTestApp();

    const response = await request(app).get("/sync-error").expect(500);

    expect(loggerError).toHaveBeenCalled();
    expect(response.body).toEqual({
      error: {
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
        details: { internalMessage: "sync failure" },
      },
    });
  });

  it("encaminha erro assincrono para o middleware global", async () => {
    const loggerError = vi.spyOn(logger, "error").mockImplementation(() => logger as never);
    const app = createTestApp();

    const response = await request(app).get("/async-error").expect(500);

    expect(loggerError).toHaveBeenCalled();
    expect(response.body).toEqual({
      error: {
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
        details: { internalMessage: "async failure" },
      },
    });
  });
});
