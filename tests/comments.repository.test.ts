import { beforeEach, describe, expect, it } from "vitest";
import commentsRepository, {
  resetCommentsRepository,
} from "../src/repositories/comments.repository.js";

describe("comments repository", () => {
  beforeEach(() => {
    resetCommentsRepository();
  });

  it("returns defensive clones in findByTicketId", () => {
    const comments = commentsRepository.findByTicketId("t1");

    expect(comments).toHaveLength(1);
    comments[0].message = "mutated externally";

    const freshComments = commentsRepository.findByTicketId("t1");
    expect(freshComments[0].message).not.toBe("mutated externally");
  });

  it("returns defensive clone on create", () => {
    const created = commentsRepository.create({
      ticketId: "t1",
      authorId: "u2",
      message: "original",
    });

    created.message = "mutated externally";

    const persisted = commentsRepository
      .findByTicketId("t1")
      .find((comment) => comment.id === created.id);

    expect(persisted).toBeDefined();
    expect(persisted?.message).toBe("original");
  });
});
