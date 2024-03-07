import { tokenize, TokenType } from './lexer.js';

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }

  parse() {
    const statements = [];
    while (!this.isAtEnd()) {
      statements.push(this.declaration());
    }
    return statements;
  }

  declaration() {
    try {
      if (this.match(TokenType.Let)) return this.varDeclaration();
      return this.expression();
    } catch (error) {
      console.error(error);
      this.synchronize();
      return null;
    }
  }

  varDeclaration() {
    const name = this.consume(TokenType.Identifier, "Expect variable name.");
    this.consume(TokenType.Equals, "Expect '=' after variable name.");
    const initializer = this.expression();
    return { type: 'VariableDeclaration', name: name.value, initializer };
  }

  expression() {
    return this.equality();
  }

  equality() {
    let expr = this.comparison();
    while (this.match(TokenType.Equals)) {
      const operator = this.previous();
      const right = this.comparison();
      expr = { type: 'BinaryExpression', operator: operator.value, left: expr, right };
    }
    return expr;
  }

  comparison() {
    // Implement comparison if needed, similar to equality()
    return this.addition();
  }

  addition() {
    let expr = this.multiplication();
    while (this.match(TokenType.BinaryOperator) && (this.previous().value === '+' || this.previous().value === '-')) {
      const operator = this.previous();
      const right = this.multiplication();
      expr = { type: 'BinaryExpression', operator: operator.value, left: expr, right };
    }
    return expr;
  }

  multiplication() {
    let expr = this.unary();
    while (this.match(TokenType.BinaryOperator) && (this.previous().value === '*' || this.previous().value === '/')) {
      const operator = this.previous();
      const right = this.unary();
      expr = { type: 'BinaryExpression', operator: operator.value, left: expr, right };
    }
    return expr;
  }

  unary() {
    // Implement unary if needed
    return this.primary();
  }

  primary() {
    if (this.match(TokenType.Number)) {
      return { type: 'Literal', value: parseFloat(this.previous().value) };
    }
    if (this.match(TokenType.Identifier)) {
      return { type: 'Variable', name: this.previous().value };
    }
    if (this.match(TokenType.OpenParem)) {
      const expr = this.expression();
      this.consume(TokenType.CloseParem, "Expect ')' after expression.");
      return { type: 'Grouping', expression: expr };
    }
    throw new Error("Expect expression.");
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

  consume(type, message) {
    if (this.check(type)) return this.advance();
    throw new Error(message);
  }

  check(type) {
    if (this.isAtEnd()) return false;
    return this.tokens[this.current].type === type;
  }

  advance() {
    if (!this.isAtEnd()) this.current++;
    return this.tokens[this.current - 1];
  }

  isAtEnd() {
    return this.tokens[this.current].type === TokenType.EOF;
  }

  previous() {
    return this.tokens[this.current - 1];
  }

  synchronize() {
    this.advance();
    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.EOF) return;
      this.advance();
    }
  }
}


const sourceCode = 'let x = 5 + 3';

const tokens = tokenize(sourceCode)

// Usage example
// Assuming `tokens` is an array of tokens from the lexer
const parser = new Parser(tokens);
const ast = parser.parse();
console.log(ast);
