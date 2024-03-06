const NodeType = {
  Program :"Program",
  NumericLiteral :"NumericLiteral",
  Identifier :"Identifier",
  BinaryExpr :"BinaryExpr",
  CallExpr :"CallExpr",
  UnaryExpr :"UnaryExpr",
  FunctionDeclaration :"FunctionDeclaration",
}

const stmt ={kind: NodeType}

const Program ={kind:NodeType.Program , body: [stmt]}


const Expr = {}

const BinaryExpr = {
  kind: NodeType.BinaryExpr,
  left: Expr,
  right: Expr,
  operator: string,
}
const Identifier = {
  kind: NodeType.Identifier,
  symbol: string,
}
const NumericLiteral = {
  kind: NodeType.NumericLiteral,
  value: number
}



const CallExpr = {}
const UnaryExpr = {}
const FunctionDeclaration = {}


