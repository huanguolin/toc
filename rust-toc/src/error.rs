use std::{error::Error, fmt::{self, Debug, Display, Formatter}};

#[derive(Debug)]
pub enum TocErrKind {
    RuntimeError,
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

#[derive(Debug)]
pub struct TocErr {
    pub kind: TocErrKind,
    pub msg: String,
}

impl Display for TocErr {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        f.write_str(&format!("[{}]: {}", self.kind, self.msg))
    }
}

impl Error for TocErr {
}

impl TocErr {
    pub fn new(kind: TocErrKind, msg: &str) -> Self {
        TocErr {
            kind,
            msg: msg.to_owned(),
        }
    }
}