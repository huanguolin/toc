use std::{error::Error, fmt::{self, Debug, Display, Formatter}};

#[derive(Debug)]
pub enum TocErrKind {
    ScanFail,
    ParseFail,
    UnknownToken,
    UnknownKeyword,
    UnknownSymbol,
}

impl Display for TocErrKind {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}

pub struct TocErr {
    pub kind: TocErrKind,
    pub msg: String,
}

impl Display for TocErr {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        f.write_str(&format!("[Error: {}]: {}", self.kind, self.msg))
    }
}

impl Debug for TocErr {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result  {
        f.debug_struct("TocErr").field("kind", &self.kind).field("msg", &self.msg).finish()
    }
}

impl Error for TocErr {
}

impl TocErr {
    pub fn new(kind: TocErrKind, msg: String) -> Self {
        TocErr {
            kind,
            msg,
        }
    }
}