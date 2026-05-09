import { describe, expect, it, vi } from "vitest";

const morganMock = vi.fn(() => (_req: unknown, _res: unknown, next: () => void) => next());

async function loadAppWithEnv(nodeEnv: string | undefined) {
  const previousNodeEnv = process.env.NODE_ENV;

  if (nodeEnv === undefined) {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = nodeEnv;
  }

  vi.resetModules();
  vi.doMock("morgan", () => ({ default: morganMock }));

  await import("../src/app.js");

  process.env.NODE_ENV = previousNodeEnv;
}

describe("app logging configuration", () => {
  it("uses tiny format in test environment", async () => {
    morganMock.mockClear();

    await loadAppWithEnv("test");

    expect(morganMock).toHaveBeenCalledWith("tiny");
  });

  it("uses combined format outside test environment", async () => {
    morganMock.mockClear();

    await loadAppWithEnv("development");

    expect(morganMock).toHaveBeenCalledWith("combined");
  });
});
