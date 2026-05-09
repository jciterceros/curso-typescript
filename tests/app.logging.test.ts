import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import app from "../src/app.js";
import logger from "../src/utils/logger.js";

describe("app logging configuration", () => {
  it("propagates incoming request id to response header", async () => {
    const response = await request(app).get("/users").set("x-request-id", "req-123").expect(200);

    expect(response.headers["x-request-id"]).toBe("req-123");
  });

  it("logs structured JSON and redacts sensitive fields", async () => {
    const loggerInfo = vi.spyOn(logger, "info").mockImplementation(() => logger as never);

    await request(app)
      .post("/tickets")
      .send({
        title: "ab",
        description: "x",
        status: "open",
        priority: 1,
        password: "super-secret",
      })
      .expect(400);

    expect(loggerInfo).toHaveBeenCalled();
    const lastCall = loggerInfo.mock.calls.at(-1);
    expect(lastCall).toBeDefined();

    const logEntry = (lastCall?.[0] ?? {}) as {
      event: string;
      requestId: string;
      body: { password?: string };
      statusCode: number;
    };

    expect(logEntry.event).toBe("http_request");
    expect(logEntry.requestId).toEqual(expect.any(String));
    expect(logEntry.statusCode).toBe(400);
    expect(logEntry.body.password).toBe("[REDACTED]");
  });
});
