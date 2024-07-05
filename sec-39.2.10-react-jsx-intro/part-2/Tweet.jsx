const Tweet = ({name, username, message, date}) => (
  <div className="tweet">
    <p className="header">
      <span className="name">{name}</span>
      <small className="username">@{username}</small></p>
    <p className="message">{message}</p>
    <p className="footer">
      <small>{date.toLocaleString()}</small>
    </p>
  </div>
);
