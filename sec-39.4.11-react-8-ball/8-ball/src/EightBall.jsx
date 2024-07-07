import React, {useState} from "react";
import './EightBall.css'

const START_PROMPT = {msg: 'Think of a Question', color: 'black'};
const START_COUNTS = {red: 0, goldenrod: 0, green: 0};

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
    setOutput(START_PROMPT);
    setColorCounts(START_COUNTS);
  }
  function pickMessage() {
    const idx = Math.floor(Math.random() * answers.length);
    setOutput(answers[idx]);
    colorCounts[answers[idx].color]++;
    setColorCounts(colorCounts);
  }

  const [output, setOutput] = useState(START_PROMPT);
  const [colorCounts, setColorCounts] = useState(START_COUNTS);

  return (
    <div className="EightBall">
      <h2 style={{backgroundColor: output.color}} onClick={pickMessage}>{output.msg}</h2>
      <p>
        <button onClick={reset}>Reset</button>
        <span className="count red">{colorCounts.red}</span>
        <span className="count goldenrod">{colorCounts.goldenrod}</span>
        <span className="count green">{colorCounts.green}</span>
      </p>
    </div>
  );
}

export default EightBall;