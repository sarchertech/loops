const TokenType = Object.freeze({
  ident: Symbol("IDENT"),
  pipe: Symbol("PIPE"), // |
  plus: Symbol("PLUS"), // +
  minus: Symbol("MINUS"), // -
  eof: Symbol("EOF"),
  newline: Symbol("NEWLINE"),
})

const Reserved = Object.freeze({
  'when': TokenType.when,
})

class Token {
  constructor(type, value, line) {
    this.type = type;
    this.value = value;
    this.line = line;
    Object.freeze(this);
  }
}

class Lexer {
  tokens = [];
  errors = [];
  start = 0;
  current = 0;
  line = 1;

  constructor(source) {
    this.source = source;
  }

  scanTokens() {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token(TokenType.eof, "", this.line));
    return this.tokens;
  }

  isAtEnd() {
    return this.current >= this.source.length;
  }

  scanToken() {
    const c = this.advance();
    switch (c) {
      case '|':
        this.addToken(TokenType.pipe);
        break;
      case '+':
        this.addToken(TokenType.plus);
        break;
      case '-':
        this.addToken(TokenType.minus);
        break;

      case '#':
        while (this.peek() != '\n' && !this.isAtEnd()) this.advance();
        break;

      // Ignore whitespace
      case ' ': break;
      case '\r': break;
      case '\t': break;
      case '\n':
        this.addToken(TokenType.newline);
        this.line++;
        // Consume additional newlines 
        while (this.peek() == '\n' && !this.isAtEnd()) {
          this.line++;
          this.advance();
        }
        break;

      default:
        if (this.isLowerAlpha(c)) {
          this.identifier();
        } else {
          this.addError(`Unexpected character ${c}`)
        }
        break;
    }
  }

  advance() {
    return this.source.charAt(this.current++);
  }

  addToken(type, text) {
    if (text == undefined)
      text = this.source.substring(this.start, this.current);

    const token = new Token(type, text, this.line)
    this.tokens.push(token);
  }

  addTokenIfMatch(pattern, type) {
    switch (pattern.length) {
      case 1:
        if (this.match(pattern[0])) {
          this.addToken(type);
          return true;
        }
        return false;
      case 2:
        if (this.peek() == pattern[0] && this.peekNext() == pattern[1]) {
          this.addToken(type);
          this.current += 2;
          return true;
        }
        return false;
      default:
        throw 'Function only supports pattern of length 1 or 2!';
    }
  }

  addFirstMatch(patternTokenPairs, defaultToken) {
    for (const patternTokenPair of patternTokenPairs) {
      const pattern = patternTokenPair[0];
      const token = patternTokenPair[1];

      if (this.addTokenIfMatch(pattern, token)) {
        return;
      }
    }

    this.addToken(defaultToken);
  }

  match(expected) {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) != expected) return false;

    this.current++;
    return true;
  }

  peek() {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.current);
  }

  peekNext() {
    if (this.current + 1 >= this.source.length) return '\0';
    return this.source.charAt(this.current + 1);
  }

  isDigit(c) {
    return c >= '0' && c <= '9';
  }

  isAlpha(c) {
    return (c >= 'a' && c <= 'z') ||
      (c >= 'A' && c <= 'Z') ||
      c == '_';
  }

  isLowerAlpha(c) {
    return (c >= 'a' && c <= 'z') || c == '_';
  }

  isAlphaNumeric(c) {
    return this.isAlpha(c) || this.isDigit(c);
  }

  identifier() {
    while (this.isAlphaNumeric(this.peek())) this.advance();

    if (this.peek() == '!' || this.peek() == '?') {
      this.advance();
    }

    const text = this.source.substring(this.start, this.current);
    const type = Reserved[text];
    if (type == null) {
      this.addToken(TokenType.ident, text);
    } else {
      this.addToken(type, text);
    }
  }

  addError(message) {
    this.errors.push({ message: message })
  }
}

// const src = `
// a | + b 
// b | - a 

// a | + c 
// `

// let lex = new Lexer(src);

// lex.scanTokens();
// console.log(lex.tokens)
// console.log(lex.errors)

// @next
// expression -> IDENT PIPE (PLUS | MINUS) IDENT NEWLINE
// make a recursive descent parser that parses the above grammar
// and returns an AST
