const Person = (props) => {
  const voteMsg = props.age >= 18? "Please go vote!" : "You must be at least 18 to vote";
  const displayName = props.name.length < 8? props.name : props.name.slice(0,6) + "...";

  return (
  <div>
    <p>Learn some information about this person</p>
    <h3>{displayName} - {props.age}</h3>
    <h3>{voteMsg}</h3>

    <ul>
      {props.hobbies.map(h => <li>{h}</li>)}
    </ul>

    <hr />
  </div>
  )
};