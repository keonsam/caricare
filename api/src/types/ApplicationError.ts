// TODO refactor
export class ApplicationError extends Error {
  name = 'Internal Server Error';
  status = 500;
}

export class BadRequestError extends ApplicationError {
  name = 'BadRequest';
  status = 400;

  constructor(message: string, stack?: string) {
    super(message);
    this.stack = stack;
  }
}

export class UnAuthorizedError extends ApplicationError {
  name = 'Unauthorized';
  status = 401;

  constructor(message: string, stack?: string) {
    super(message);
    this.stack = stack;
  }
}

export class ForbiddenError extends ApplicationError {
  name = 'Forbidden';
  status = 403;

  constructor(message: string, stack?: string) {
    super(message);
    this.stack = stack;
  }
}

export class NotFoundError extends ApplicationError {
  name = 'Not Found';
  status = 404;

  constructor(message: string, stack?: string) {
    super(message);
    this.stack = stack;
  }
}

export class ConflictError extends ApplicationError {
  name = 'Conflict';
  status = 409;

  constructor(message: string, stack?: string) {
    super(message);
    this.stack = stack;
  }
}
