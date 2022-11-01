export type ErrorResult<E> = { type: 'Error'; error: E };
export type SuccessResult<R> = { type: 'Success'; result: R };

export type NoWay<Name extends string> = `[${Name}] impossible here!`;
