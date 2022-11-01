import { ErrorResult } from '../Result';

export type RuntimeError<M extends string> =
    ErrorResult<`[RuntimeError]: ${M}`>;
