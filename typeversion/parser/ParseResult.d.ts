import { ErrorResult, SuccessResult } from "../Result";
import { Expr } from "./Expr";
import { Token } from "../scanner/Token";

export type ParseError<M extends string> = ErrorResult<`[ParseError]: ${M}`>;
export type ParseSuccess<R extends Expr, T extends Token[]> = SuccessResult<{ expr: R, rest: T }>;
export type ParseResult<R, E> = { success: R, error: E };
