import fs from 'fs';

const NodeType = {
  Program: "Program",
  NumericLiteral: "NumericLiteral",
  Identifier: "Identifier",
  BinaryExpr: "BinaryExpr",
  CallExpr: "CallExpr",
  UnaryExpr: "UnaryExpr",
  FunctionDeclaration: "FunctionDeclaration",
};

// Assuming you want to create a specific statement as an example, specify its kind.
// This is a placeholder; you'll need to adjust according to your actual usage.
const stmt = { kind: NodeType.Program };

const Program = { kind: NodeType.Program, body: [stmt] };

// Assuming Expr is meant to be a base type or placeholder for expressions
const Expr = {};

const BinaryExpr = {
  kind: NodeType.BinaryExpr,
  left: Expr,  // These should later point to actual expression objects
  right: Expr, // These should later point to actual expression objects
  operator: "", // Initialized as empty string, update to actual operator later
};

const Identifier = {
  kind: NodeType.Identifier,
  symbol: "", // Initialized as empty string, update to actual identifier later
};

const NumericLiteral = {
  kind: NodeType.NumericLiteral,
  value: 0, // Initialized with a default value, update to actual number later
};

// Placeholder objects, assuming you'll expand these definitions later
const CallExpr = {};
const UnaryExpr = {};
const FunctionDeclaration = {};

export { stmt, Program, Expr, BinaryExpr, NumericLiteral, Identifier, CallExpr, UnaryExpr, FunctionDeclaration };
