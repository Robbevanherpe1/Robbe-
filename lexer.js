const fs = require('fs');

// Definitie van token types
const TokenType = {
  Number: "Number", // Nummer
  Identifier: "Identifier", // Identifier
  Equals: "Equals", // Gelijkheidsteken
  OpenParem: "OpenParem", // Open haakje
  CloseParem: "CloseParem", // Sluit haakje
  BinaryOperator: "BinaryOperator", // Binaire operator
  Let: "Let", // Laat
  EOF:"EOF"//einde van bestand
};

// Gereserveerde sleutelwoorden
const KEYWORDS = {
  "let": TokenType.Let,
};

// Functie om een token aan te maken
function token(value, type) {
  return { value, type };
}

// Functie om te controleren of het alfabetische tekens zijn
function isAlpha(src) {
  return /^[A-Za-z]+$/.test(src);
}

// Functie om te controleren of het gehele getallen zijn
function isInt(src) {
  return /^[0-9]+$/.test(src);
}

// Functie om te controleren of het te negeren tekens zijn
function isSkippable(src) {
  return /^\s+$/.test(src) || src === '';
}

// Functie om de broncode te tokeniseren
function tokenize(sourceCode) {
  const tokens = [];
  let src = sourceCode.split("");

  while (src.length > 0) {
    if (isSkippable(src[0])) {
      src.shift();
      continue;
    }
    if (src[0] === '(') {
      tokens.push(token(src.shift(), TokenType.OpenParem));
    } else if (src[0] === ')') {
      tokens.push(token(src.shift(), TokenType.CloseParem));
    } else if ('+-*/'.includes(src[0])) {
      tokens.push(token(src.shift(), TokenType.BinaryOperator));
    } else if (src[0] === '=') {
      tokens.push(token(src.shift(), TokenType.Equals));
    } else if (isInt(src[0])) {
      let num = "";
      while (src.length > 0 && isInt(src[0])) {
        num += src.shift();
      }
      tokens.push(token(num, TokenType.Number));
    } else if (isAlpha(src[0])) {
      let ident = "";
      while (src.length > 0 && isAlpha(src[0])) {
        ident += src.shift();
      }
      const reserved = KEYWORDS[ident];
      if (reserved === undefined) {
        tokens.push(token(ident, TokenType.Identifier));
      } else {
        tokens.push(token(ident, reserved));
      }
    } else {
      console.log("Onbekend teken niet geïmplementeerd:", src[0]);
      src.shift(); // Ga voorbij het onbekende teken om oneindige lus te voorkomen
    }
  }
  tokens.push((TokenType.EOF,"Einde bestand" ))
  return tokens;
}

// output tonen lexer
fs.readFile('text.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("Bestandsinhoud:", data); // Log de inhoud van het bestand
  const tokens = tokenize(data.trim());
  console.log(tokens);
});
