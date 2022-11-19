pub trait FirstChar {
    fn first_char(&self) -> Option<char>;
    fn first_char_is_none(&self) -> bool;
    fn first_char_is_some(&self) -> bool;
    fn first_char_is_some_and<F: FnOnce(char) -> bool>(&self, f: F) -> bool;
    fn first_char_is_alphanumeric(&self) -> bool;
    fn first_char_is_alpha(&self) -> bool;
    fn first_char_is_numeric(&self) -> bool;
}

impl FirstChar for str {
    fn first_char(&self) -> Option<char> {
        self.chars().next()
    }

    fn first_char_is_none(&self) -> bool {
        self.first_char().is_none()
    }

    fn first_char_is_some(&self) -> bool {
        self.first_char().is_some()
    }

    fn first_char_is_some_and<F: FnOnce(char) -> bool>(&self, f: F) -> bool {
        if let Some(c) = self.first_char() {
            f(c)
        } else {
            false
        }
    }

    fn first_char_is_alpha(&self) -> bool {
        self.first_char_is_some_and(|fc| fc.is_ascii_alphabetic() || fc == '_')
    }

    fn first_char_is_numeric(&self) -> bool {
        self.first_char_is_some_and(|fc| fc.is_ascii_digit())
    }

    fn first_char_is_alphanumeric(&self) -> bool {
        self.first_char_is_some_and(|fc| fc.is_ascii_alphanumeric() || fc == '_')
    }
}