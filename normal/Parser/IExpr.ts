import { IVisitor } from "./IVisitor";

export type ExprType = 'group' | 'binary' | 'literal';

export interface IExpr {
    type: ExprType;
    accept: (visitor: IVisitor) => number;
}