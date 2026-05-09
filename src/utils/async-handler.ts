import type { NextFunction, Request, Response } from "express";

type ControllerHandler<Req extends Request = Request, Res extends Response = Response> = (
  req: Req,
  res: Res,
  next: NextFunction,
) => void | Promise<void>;

/**
 * Wrapper para route handlers que automaticamente captura erros síncronos e assincronos.
 * Converte erros lançados (throw) ou Promise rejections para o middleware de erro.
 *
 * @example
 * ```typescript
 * show = asyncHandler(ticketsController.show.bind(ticketsController)),
 * ```
 */
export function asyncHandler<Req extends Request = Request, Res extends Response = Response>(
  fn: ControllerHandler<Req, Res>,
) {
  return (req: Req, res: Res, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
