import { IExprVisitor } from "./IExprVisitor";

export type ExprType =
    | 'assign'
    | 'group'
    | 'binary'
    | 'unary'
    | 'literal'
    | 'variable';

export interface IExpr {
    type: ExprType;
    accept: <R>(visitor: IExprVisitor<R>) => R;
}