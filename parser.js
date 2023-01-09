// PROGRAM -> STATEMENT* EOF
// STATEMENT -> EXPRESSION NEWLINE,
//              EXPRESSION EOF
// EXPRESSION -> IDENT PIPE (PLUS | MINUS) IDENT,
//               IDENT PIPE IDENT

class Parser {
  current = 0;
  ast = [];
  errors = [];

  constructor(tokens) {
    this.tokens = tokens;
  }

  statement() {
    const expr = this.expression();
    this.consumeFirstMatching("Expect newline or EOF after expression.", TokenType.newline, TokenType.expression);
    return expr;
  }

  expression() {
    const left = this.consume(TokenType.ident, "Expect identifier.").value;
    const operator = this.consume(TokenType.pipe, "Expect pipe.").value;

    if (this.peek().type == TokenType.plus || this.peek().type == TokenType.minus) {
      const func = this.consumeFirstMatching("Expect plus or minus.", TokenType.plus, TokenType.minus).value;
      const right = this.consume(TokenType.ident, "Expect identifier.").value;
      return { operator, func, left, right };
    } else {
      const right = this.consume(TokenType.ident, "Expect identifier.").value;
      return { operator, left, right };
    }
  }

  parse() {
    console.log("Start parsing tokens")
    console.log(this.tokens);
    while (this.tokens[this.current].type != TokenType.eof) {
      try {
        this.ast.push(this.statement());
      } catch (e) {
        console.log("------");
        console.error(e);
        console.log(this.tokens[this.current])
        while (this.tokens[this.current].type != TokenType.newline && this.tokens[this.current].type != TokenType.eof) {
          console.log(this.tokens[this.current]);
          this.advance();
        }
        this.advance();
        console.log("------");
      }
    }
  }

  match(...types) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  consumeFirstMatching(message, ...types) {
    for (const type of types) {
      if (this.check(type)) return this.advance();
    }

    this.errors.push({ line: this.peek().line, message: message });
  }

  consume(type, message) {
    if (this.check(type)) return this.advance();

    this.errors.push({ line: this.peek().line, message: message });
    throw message;
  }

  check(type) {
    if (this.isAtEnd()) return false;
    return this.peek().type == type;
  }

  advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  isAtEnd() {
    return this.peek().type == TokenType.eof;
  }

  peek() {
    return this.tokens[this.current];
  }

  previous() {
    return this.tokens[this.current - 1];
  }
}

