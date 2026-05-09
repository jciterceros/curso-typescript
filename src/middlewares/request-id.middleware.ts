import type { RequestHandler } from "express";
import { randomUUID } from "node:crypto";

const REQUEST_ID_HEADER = "x-request-id";

const requestIdMiddleware: RequestHandler = (req, res, next) => {
  const incomingRequestId = req.header(REQUEST_ID_HEADER);
  const requestId =
    typeof incomingRequestId === "string" && incomingRequestId.trim() !== ""
      ? incomingRequestId
      : randomUUID();

  res.locals.requestId = requestId;
  res.setHeader(REQUEST_ID_HEADER, requestId);

  next();
};

export default requestIdMiddleware;
