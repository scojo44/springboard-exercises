const Tweet = (props) => (
  <div className="tweet">
    <p className="header">
      <span className="name">{props.name}</span>
      <small className="username">@{props.username}</small></p>
    <p className="message">{props.message}</p>
    <p className="footer">
      <small>{props.date.toLocaleString()}</small>
    </p>
  </div>
)
