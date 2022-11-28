use std::io::{stdin, stdout, Write};

use termion::{
    clear,
    cursor::{self},
    event::{self, Key},
    input::TermRead,
    raw::IntoRawMode,
};

pub struct Repl {
    capability: usize,
    queue: Vec<String>,
    index: usize,
    input_str: Vec<char>,
    prefix: String,
    cur_x: usize,
}

impl Repl {
    pub fn init(capability: usize) -> Self {
        Repl {
            capability,
            queue: Vec::with_capacity(capability),
            index: 0,
            input_str: Vec::new(),
            prefix: String::with_capacity(0),
            cur_x: 0,
        }
    }

    pub fn run<F>(&mut self, prefix: &str, cb: F)
    where
        F: Fn(String) -> String,
    {
        self.prefix = prefix.to_string();

        let mut stdout = stdout().into_raw_mode().unwrap();

        self.render_prefix();
        stdout.flush().unwrap();

        let stdin = stdin();
        for k in stdin.keys() {
            let c = k.unwrap();
            match c {
                Key::Ctrl('c' | 'C') => break,
                Key::Home | Key::End | Key::Left | Key::Right | Key::Up | Key::Down => self.move_cur(&c),
                Key::Backspace | Key::Delete => self.remove_char(&c),
                Key::Char(c) => {
                    if c == '\n' {
                        self.push_history();
                        self.render_result(cb(self.get_input_str()));
                    } else {
                        self.input(c);
                        self.render_input();
                    }
                }
                _ => {}
            }
            stdout.flush().unwrap();
        }
    }

    fn move_cur(&mut self, direct: &event::Key) {
        match direct {
            Key::Left => self.dec_cur_x(),
            Key::Right => self.inc_cur_x(),
            Key::Up => self.move_up(),
            Key::Down => self.move_down(),
            _ => {}
        }
    }

    fn remove_char(&mut self, direct: &event::Key) {
        match direct {
            Key::Backspace => {
                let i = self.get_input_index();
                if i > 0 {
                    self.input_str.remove(i - 1);
                    self.dec_cur_x();
                    self.render_input();
                }
            },
            Key::Delete => {
                let i = self.get_input_index();
                if i < self.input_str.len() {
                    self.input_str.remove(self.get_input_index());
                    self.inc_cur_x();
                    self.render_input();
                }
            },
            _ => {}
        }
    }

    fn inc_cur_x(&mut self) {
        let i = self.get_input_index();
        if i < self.input_str.len() {
            self.cur_x += 1;
            print!("{}", cursor::Right(1));
        }
    }

    fn dec_cur_x(&mut self) {
        let i = self.get_input_index();
        if i > 0 {
            self.cur_x -= 1;
            print!("{}", cursor::Left(1));
        }
    }

    fn get_input_str(&self) -> String {
        String::from_iter(&self.input_str)
    }

    fn get_input_index(&self) -> usize {
        self.cur_x - self.prefix.len()
    }

    fn input(&mut self, c: char) {
        self.input_str.insert(self.get_input_index(), c);
        self.inc_cur_x();
    }

    fn render_prefix(&mut self) {
        print!("{}{}", cursor::Save, self.prefix);
        self.cur_x = self.prefix.len();
    }

    fn render_input(&mut self) {
        print!("{}{}{}{}", clear::CurrentLine, cursor::Restore, self.prefix, self.get_input_str());
        let move_left_cnt = self.prefix.len() + self.input_str.len() - self.cur_x;
        if move_left_cnt > 0 {
            // move cursor to 'self.cur_x'
            print!("{}", cursor::Left(move_left_cnt as u16))
        }
    }

    fn render_result(&mut self, res: String) {
        // print newline
        print!("\n");
        // move cursor to line start
        print!("{}", cursor::Left(self.cur_x as u16));

        // print result
        let lines = res.split('\n');
        for line in lines {
            print!("{}\n", line);
            print!("{}", cursor::Left(line.len() as u16));
        }

        // save cursor position
        print!("{}", cursor::Save);
        self.cur_x = 0;

        // clear input
        self.input_str.clear();

        // print prefix
        self.render_prefix();
    }

    fn push_history(&mut self) {
        let current = self.get_input_str();
        let h_len = self.queue.len();

        // skip same with last one
        if h_len > 0 && self.queue[h_len - 1] == current {
            return;
        }

        // remove the oldest one when full
        if h_len == self.capability {
            self.queue.remove(0);
        }

        // push and reset index
        self.queue.push(current);
        self.index = 0;
    }

    fn move_up(&mut self) {
        if self.index < self.queue.len() {
            self.index += 1;
        }
        self.use_history();
    }

    fn move_down(&mut self) {
        if self.index > 0 {
            self.index -= 1;
        }
        self.use_history();
    }

    fn get_history_index(&self) -> usize {
        self.queue.len() - self.index
    }

    fn use_history(&mut self) {
        let hi = self.get_history_index();
        if hi >= self.queue.len() {
            return;
        }

        // clear
        print!("{}{}", clear::CurrentLine, cursor::Restore);
        self.cur_x = 0;
        self.input_str.clear();

        // fill use selected history
        let history = &self.queue[hi];
        self.input_str = history.chars().collect::<Vec<char>>();
        self.cur_x = self.prefix.len() + self.input_str.len();

        // print history
        self.render_input();
    }
}
