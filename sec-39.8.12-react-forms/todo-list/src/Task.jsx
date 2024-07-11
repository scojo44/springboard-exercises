import React from 'react'
import './Task.css'

function Task({id, task, remove, update, completed }) {
  /** Have TodoList know remove the todo from the list */
  function removeClicked(e) {
    remove(id);
  }

  /** Let TodoList know this todo is being edited */
  function editClicked(e) {
    update(id, task, completed, true);
  }

  /** Mark the task as completed */
  function doneChanged(e) {
    update(id, task, e.target.checked);
  }

  const checkboxID = "toggle-" + id;

  return (
    <>
      <div className="Task">
        <input type="checkbox" id={checkboxID} checked={completed} onChange={doneChanged} />
        <label htmlFor={checkboxID} className={completed? ' done' : ''}>{task}</label>
      </div>
      <div><button onClick={editClicked}>Edit</button></div>
      <div><button onClick={removeClicked}>X</button></div>
    </>
  )
}

export default Task
