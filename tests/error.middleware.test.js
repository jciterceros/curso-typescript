import errorMiddleware from '../src/middlewares/error.middleware.ts';

describe('error middleware', () => {
  it('retorna 500 com payload padrao para Error', () => {
    const json = vi.fn();
    const res = {
      status: vi.fn(() => ({ json })),
    };
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    errorMiddleware(new Error('falha inesperada'), {}, res, vi.fn());

    expect(consoleError).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
      error: 'falha inesperada',
    });

    consoleError.mockRestore();
  });

  it('converte valores nao-Error para string no payload 500', () => {
    const json = vi.fn();
    const res = {
      status: vi.fn(() => ({ json })),
    };
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    errorMiddleware('falha crua', {}, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
      error: 'falha crua',
    });

    consoleError.mockRestore();
  });
});