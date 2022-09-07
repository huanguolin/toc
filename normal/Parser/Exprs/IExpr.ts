import { IExprVisitor } from "./IExprVisitor";

export type ExprType =
    | 'group'
    | 'binary'
    | 'unary'
    | 'literal';

export interface IExpr {
    type: ExprType;
    accept: <R>(visitor: IExprVisitor<R>) => R;
}