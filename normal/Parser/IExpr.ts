import { IVisitor } from "./IVisitor";

export type ExprType =
    |'group'
    | 'binary'
    | 'unary'
    | 'literal';

export interface IExpr {
    type: ExprType;
    accept: <R>(visitor: IVisitor<R>) => R;
}