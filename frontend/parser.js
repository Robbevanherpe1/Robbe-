import fs from 'fs';
import {stmt,Program,Expr,BinaryExpr, NumericLiteral,Identifier} from "./ast.js"
import { tokenize, token, TokenType } from './lexer.js';


  const tokens = []

  function not_eof(){
    return this.token[0].type != TokenType.EOF
  }

  function at(){
    return this.token[0]
  }

  function next(){
    const prev = this.tokens.shift()
    return prev
  }

  function produceAST(SourceCode){

    this.tokens = tokenize(SourceCode);
    const program = {
      kind: NodeType.Program,
      body: []
    }

    while(not_eof()){
      program.body.push(this.parse_stmt())

    }

    return program
  }

  function parse_stmt(){

    return this.parse_expr()
  }


  function parse_expr(){}
  function parse_primary_expr(){

    const tk = this.at().type

    switch (tk){
      case TokenType.Identifier:
        return {kind: "Identifier", Symbol: this.next().value}
      case TokenType.NumericLiteral:
        return {kind: "NumericLiteral", value: parseFloat(this.next().value)}
      
        default: 
        console.error("Onbekend teken in parsing",this.at())
    }
  }


  export {produceAST}


