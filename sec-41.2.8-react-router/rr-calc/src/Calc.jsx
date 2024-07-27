import React from 'react'
import {useParams} from 'react-router-dom'

const Calc = () => {
  const {op} = useParams();
  let {a, b} = useParams();
  let result;
  let symbol;

  // Convert to integers
  a = +a;
  b = +b;

  // Do the math
  switch(op) {
    case 'add':
      symbol = '+';
      result = a + b;
      break;

    case 'subtract':
      symbol = '-';
      result = a - b;
      break;

    case 'multiply':
      symbol = 'x';
      result = a * b;
      break;

    case 'divide':
      symbol = '/';
      if(b === 0) return <p>Can't divide by zero!</p>
      result = a / b;
      break;

    default:
      return <p>Unsupported operation!</p>
  }

  return <p>{a} {symbol} {b} = {result}</p>
}

export default Calc
