import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { numberFromInputSchema } from "../src/utils/validation.js";

describe("numberFromInputSchema", () => {
  it("runs preprocess for undefined input", () => {
    const schema = numberFromInputSchema(1, 5);

    const result = schema.safeParse(undefined);
    expect(result.success).toBe(false);
  });

  it("converts numeric string input to number", () => {
    const schema = numberFromInputSchema(1, 5);

    expect(schema.parse("3")).toBe(3);
  });

  it("accepts numeric input without string conversion", () => {
    const schema = numberFromInputSchema(1, 5);

    expect(schema.parse(4)).toBe(4);
  });

  it("rejects empty string input", () => {
    const schema = numberFromInputSchema(1, 5);

    expect(() => schema.parse("")).toThrow(ZodError);
  });
});
