const Alert = ({message, category}) => {
  const alertClass = `alert-${category}`;
  return (
    <aside className={alertClass}>
      {message}
    </aside>
  )
}
