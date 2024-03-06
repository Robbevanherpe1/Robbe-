export const TokenType =  {
  Number,
  Identifier,
  Equals,
  OpenParem,
  CloseParem,
  BinaryOperator,
  Let,
}

//gereserveerde keywords
const KEYWORDS ={

  "let": TokenType.Let
}

export let Token = {
    value: string,
    type: TokenType

}

//aanmaken token 
function token(value,type) {

  return {value,type}
}

//meerdere characters token verwerken

  // contorleren voor text
  function isaplha (src){
    return src.toUpperCase() != src.toLowerCase()
  }

  // contorleren voor int
  function isint (src){
    const c = str.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0),'9'.charCodeAt(0)];
    return (c >= bounds[0] && c<= bounds[1])
  }

   // contorleren voor skipbare characters
   function isskippable (src){
    return str =='' || str =='\n' || str =='\t';
  }




export function tokenSize(sourceCode){
  const tokens = [];
  const src = sourceCode.split("");

  while(src.length >0){
      if( src[0] == '('){
        tokens.push(token(src.shift(),TokenType.OpenParem));
      } else if (src[0] == ')') {
        tokens.push(token(src.shift(),TokenType.CloseParem));
      }
      else if (src[0] == '+' || scr[0] =="-" || src[0] == '*' || scr[0] =="/") {
        tokens.push(token(src.shift(),TokenType.BinaryOperator));
      }
      else if (src[0] == '=') {
        tokens.push(token(src.shift(),TokenType.Equals));
      } else{

          //meerdere characters token verwerken

          //maak nummer token
          if (isint(scr[0])){
            let num ="";
            while (scr.length > 0 && isint(scr[0])){
              num += scr.shift
            }
            tokens.push(token(num,TokenType.Number))

            //maak text token
          }else{
            if (isaplha(src[0])){

              let ident ="";
              while(src.length > 0 && isaplha(scr[0])){
                ident += scr.shift();
              }

              //contorler gereserveerde keywords
              const reserved = KEYWORDS[ident]
              if(reserved == undefined){
                tokens.push(token(ident,TokenType.Identifier))
              }else{
                tokens.push(token(ident,TokenType.reserved))
              } 
            }
          }
      }  
  }

  return tokens;
}