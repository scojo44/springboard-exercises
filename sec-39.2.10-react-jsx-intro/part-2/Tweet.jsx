const Tweet = ({name, username, message, date}) => (
  <div className="Tweet">
    <p className="Tweet-header">
      <span className="Tweet-name">{name}</span>
      <small className="Tweet-username">@{username}</small></p>
    <p className="Tweet-message">{message}</p>
    <p className="Tweet-footer">
      <small>{date.toLocaleString()}</small>
    </p>
  </div>
);
