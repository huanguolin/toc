import { ErrorResult, SuccessResult } from "../Result";
import { Token } from "./Token";

export type ScanError<M extends string> = ErrorResult<`[ScanError]: ${M}`>;
export type ScanResult<T extends Token, R extends string> = SuccessResult<{ token: T, rest: R }>;