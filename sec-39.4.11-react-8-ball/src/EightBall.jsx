import React, {useState} from "react";
import './EightBall.css'

const START_COLOR = 'black';
const START_MESSAGE = 'Think of a Question';

const answersDB = [
  { msg: "It is certain.", color: "green" },
  { msg: "It is decidedly so.", color: "green" },
  { msg: "Without a doubt.", color: "green" },
  { msg: "Yes - definitely.", color: "green" },
  { msg: "You may rely on it.", color: "green" },
  { msg: "As I see it, yes.", color: "green" },
  { msg: "Most likely.", color: "green" },
  { msg: "Outlook good.", color: "green" },
  { msg: "Yes.", color: "green" },
  { msg: "Signs point to yes.", color: "goldenrod" },
  { msg: "Reply hazy, try again.", color: "goldenrod" },
  { msg: "Ask again later.", color: "goldenrod" },
  { msg: "Better not tell you now.", color: "goldenrod" },
  { msg: "Cannot predict now.", color: "goldenrod" },
  { msg: "Concentrate and ask again.", color: "goldenrod" },
  { msg: "Don't count on it.", color: "red" },
  { msg: "My reply is no.", color: "red" },
  { msg: "My sources say no.", color: "red" },
  { msg: "Outlook not so good.", color: "red" },
  { msg: "Very doubtful.", color: "red" },
]

const EightBall = ({answers = answersDB}) => {
  function reset() {
    setColor(START_COLOR);
    setMessage(START_MESSAGE);
  }
  function pickMessage() {
    const idx = Math.floor(Math.random() * answers.length);
    setMessage(answers[idx].msg);
    setColor(answers[idx].color);
  }

  const [color, setColor] = useState(START_COLOR);
  const [message, setMessage] = useState(START_MESSAGE);

  return (
    <div className="EightBall">
      <h2 style={{backgroundColor: color}} onClick={pickMessage}>{message}</h2>
      <p><button onClick={reset}>Reset</button></p>
    </div>
  );
}

export default EightBall;