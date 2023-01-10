use std::{collections::HashMap, cell::Cell};

use crate::{toc_result::TocResult, token::Token, error::{TocErr, TocErrKind}};

pub struct Env {
    pub outer: Box<Cell<Option<Env>>>,
    store: HashMap<String, TocResult>,
}

impl Env {
    pub fn new(outer: Option<Env>) -> Self {
        Self {
            store: HashMap::new(),
            outer: Box::new(Cell::new(outer)),
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

        let res = self.store
            .get(&id)
            .map(|v| v.clone());
        if res.is_some() {
            return Ok(res.unwrap())
        }

        let o = self.outer.take();
        if o.is_some() {
            let v = o.as_ref().unwrap().get(name);
            self.outer.set(o);
            return v;
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
            return Ok(())
        }

        let mut o = self.outer.take();
        if o.is_some() {
            let r = o.as_mut().unwrap().assign(name, value);
            self.outer.set(o);
            return r
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
            panic!("[Env::define] required name is identifier, but got {}.", name);
        }
    }
}
