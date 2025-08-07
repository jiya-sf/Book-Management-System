import {
  /* inject, */
  globalInterceptor,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@globalInterceptor('', {tags: {name: 'Logging'}})
export class LoggingInterceptor implements Provider<Interceptor> {
  value(): Interceptor {
    return this.intercept.bind(this);
  }

  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    const method = invocationCtx.methodName.toLowerCase();
    const controller = invocationCtx.targetName;

    const isCrud =
      ['create', 'updateById', 'replaceById', 'updateAll'].includes(method) &&
      ['BookController', 'AuthorController', 'CategoryController'].includes(
        controller,
      );

    if (isCrud) {
      console.log(
        `[INFO] ${controller}#${method} called with:`,
        invocationCtx.args[0],
      );
    }

    try {
      const result = await next();
      if (isCrud) {
        console.log(
          `[SUCCESS] ${controller}#${method} succeeded, result:`,
          result,
        );
      }
      return result;
    } catch (err: any) {
      // Error logging
      if (isCrud) {
        if (err.statusCode && err.statusCode >= 500) {
          console.error(`[ERROR] ${controller}#${method} failed!`, err.message);
        } else if (err.statusCode && err.statusCode >= 400) {
          console.warn(
            `[WARN] ${controller}#${method} client error:`,
            err.message,
          );
        } else {
          console.error(`[ERROR] ${controller}#${method} unknown error:`, err);
        }
      }
      throw err;
    }
  }
}
