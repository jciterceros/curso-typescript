import { describe, expect, it } from "vitest";
import usersRepository from "../src/repositories/users.repository.js";

describe("users repository", () => {
  it("retorna usuario por id existente", () => {
    const user = usersRepository.findById("u1");

    expect(user).toEqual(
      expect.objectContaining({
        id: "u1",
        name: expect.any(String),
        email: expect.any(String),
      }),
    );
  });

  it("retorna undefined para id inexistente", () => {
    const user = usersRepository.findById("u999");

    expect(user).toBeUndefined();
  });
});
