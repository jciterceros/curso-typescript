import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app.js";

describe("OpenAPI docs", () => {
  it("exposes raw OpenAPI JSON", async () => {
    const response = await request(app).get("/api-docs.json").expect(200);

    expect(response.body).toMatchObject({
      openapi: "3.0.3",
      info: {
        title: "Helpdesk API",
      },
      paths: expect.objectContaining({
        "/tickets": expect.any(Object),
        "/users": expect.any(Object),
      }),
    });
  });

  it("serves Swagger UI", async () => {
    const response = await request(app).get("/api-docs/").expect(200);

    expect(response.text).toContain("Swagger UI");
  });
});
