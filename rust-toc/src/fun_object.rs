use std::{cell::RefCell, fmt::Display, rc::Rc};

use crate::{
    env::Env,
    error::{TocErr, TocErrKind},
    expr::Expr,
    interpreter::Interpreter,
    stmt::{FunStmt, Stmt},
    toc_result::TocResult,
};

#[derive(Clone)]
pub struct FunObject {
    decl: FunStmt,
    env: Rc<RefCell<Env>>,
}

impl FunObject {
    pub fn new(decl: FunStmt, env: Rc<RefCell<Env>>) -> Self {
        FunObject { decl, env }
    }

    pub fn execute(
        &self,
        args: &Vec<Expr>,
        interpreter: &Interpreter,
    ) -> Result<TocResult, TocErr> {
        if args.len() != self.decl.parameters.len() {
            return Err(TocErr::new(
                TocErrKind::RuntimeError,
                &format!(
                    "Call {} error, arguments length not match parameters, required {}, given {}.",
                    &self,
                    self.decl.parameters.len(),
                    args.len(),
                ),
            ));
        }

        let env = Env::build_mut_ref(Some(Rc::clone(&self.env)));
        for (i, a) in args.iter().enumerate() {
            let av = a.accept(interpreter)?;
            let param = &self.decl.parameters[i];
            env.borrow_mut().define(param, av)?;
        }

        if let Stmt::BlockStmt(bs) = self.decl.body.as_ref() {
            interpreter.execute_block(bs, env)
        } else {
            Err(TocErr::new(
                TocErrKind::RuntimeError,
                &format!("FunObject body is not BlockStmt."),
            ))
        }
    }
}

impl Display for FunObject {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let fun_name = self.decl.name.lexeme();
        let params = self
            .decl
            .parameters
            .iter()
            .map(|p| p.lexeme())
            .collect::<Vec<String>>()
            .join(", ");
        write!(f, "<fun {}({})>", fun_name, params)
    }
}
