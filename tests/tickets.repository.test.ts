import { beforeEach, describe, expect, it } from "vitest";
import ticketsRepository, {
  resetTicketsRepository,
} from "../src/repositories/tickets.repository.js";

describe("tickets repository", () => {
  beforeEach(() => {
    resetTicketsRepository();
  });

  it("creates a ticket and persists it for subsequent reads", () => {
    const created = ticketsRepository.create({
      title: "VPN access issue",
      description: "User cannot connect to corporate VPN",
      status: "open",
      priority: 2,
      assigneeId: "u1",
    });

    const found = ticketsRepository.findById(created.id);
    const all = ticketsRepository.findAll();

    expect(found).not.toBeNull();
    expect(found).toMatchObject({
      id: created.id,
      title: "VPN access issue",
      status: "open",
      priority: 2,
      assigneeId: "u1",
    });
    expect(all.some((ticket) => ticket.id === created.id)).toBe(true);
  });

  it("updates an existing ticket and keeps changes persisted", () => {
    const before = ticketsRepository.findById("t1");
    expect(before).not.toBeNull();

    const updated = ticketsRepository.update("t1", {
      status: "closed",
      priority: 1,
      assigneeId: "u2",
    });

    const persisted = ticketsRepository.findById("t1");

    expect(updated).not.toBeNull();
    expect(updated).toMatchObject({
      id: "t1",
      status: "closed",
      priority: 1,
      assigneeId: "u2",
    });
    expect(persisted).toMatchObject({
      id: "t1",
      status: "closed",
      priority: 1,
      assigneeId: "u2",
    });
    expect(updated?.updatedAt.getTime()).toBeGreaterThanOrEqual(before!.updatedAt.getTime());
  });

  it("returns null when updating a non-existent ticket", () => {
    const updated = ticketsRepository.update("t999", { status: "closed" });

    expect(updated).toBeNull();
  });

  it("returns null for unknown ticket id", () => {
    const ticket = ticketsRepository.findById("t999");

    expect(ticket).toBeNull();
  });
});
