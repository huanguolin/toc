import { ErrorResult, SuccessResult } from "../Result";
import { Expr } from "./Expr";
import { Token } from "../scanner/Token";

export type ParseError<M extends string> = ErrorResult<`[ParseError]: ${M}`>;
export type ParseSuccess<R extends Expr, T extends Token[]> = SuccessResult<{ ast: R, rest: T }>;
