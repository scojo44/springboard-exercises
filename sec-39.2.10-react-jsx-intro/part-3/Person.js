const Person = ({name, age, hobbies}) => {
  const voteMsg = age >= 18? "Please go vote!" : "You must be at least 18 to vote";
  const displayName = name.length < 8? name : name.slice(0,6) + "...";

  return (
  <div>
    <p>Learn some information about this person</p>
    <h3>{displayName} - {age}</h3>
    <h3>{voteMsg}</h3>

    <ul>
      {hobbies.map(h => <li>{h}</li>)}
    </ul>

    <hr />
  </div>
  )
};