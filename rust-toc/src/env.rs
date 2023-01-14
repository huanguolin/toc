use std::{cell::RefCell, collections::HashMap, rc::Rc};

use crate::{
    error::{TocErr, TocErrKind},
    toc_result::TocResult,
    token::Token,
};

pub struct Env {
    pub outer: Option<Rc<RefCell<Env>>>,
    store: HashMap<String, TocResult>,
}

impl Env {
    pub fn new(outer: Option<Rc<RefCell<Env>>>) -> Self {
        Self {
            store: HashMap::new(),
            outer,
        }
    }

    pub fn define(&mut self, name: &Token, value: TocResult) -> Result<(), TocErr> {
        let id = self.get_key(&name);
        if self.store.contains_key(&id) {
            Err(TocErr::new(
                TocErrKind::RuntimeError,
                &format!("Variable '{}' is already defined.", id),
            ))
        } else {
            self.store.insert(id, value);
            Ok(())
        }
    }

    pub fn get(&self, name: &Token) -> Result<TocResult, TocErr> {
        let id = self.get_key(name);

        let res = self.store.get(&id).map(|v| v.clone());
        if res.is_some() {
            return Ok(res.unwrap());
        }

        if self.outer.is_some() {
            return self.outer.as_ref().unwrap().borrow().get(name);
        }

        Err(TocErr::new(
            TocErrKind::RuntimeError,
            &format!("Undefined variable '{}'.", id),
        ))
    }

    pub fn assign(&mut self, name: &Token, value: TocResult) -> Result<(), TocErr> {
        let id = self.get_key(&name);
        if self.store.contains_key(&id) {
            *self.store.get_mut(&id).unwrap() = value;
            return Ok(());
        }

        if self.outer.is_some() {
            return self
                .outer
                .as_ref()
                .unwrap()
                .borrow_mut()
                .assign(name, value);
        }

        Err(TocErr::new(
            TocErrKind::RuntimeError,
            &format!("Undefined variable '{}'.", id),
        ))
    }

    fn get_key(&self, name: &Token) -> String {
        if let Token::Identifier(id, _) = name {
            id.clone()
        } else {
            panic!(
                "[Env::define] required name is identifier, but got {}.",
                name
            );
        }
    }
}
