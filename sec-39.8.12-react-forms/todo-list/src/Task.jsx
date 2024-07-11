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
  function doneClicked(e) {
    update(id, task, true);
  }

  const cssClass = 'Task' + (completed? ' done' : '');

  return (
    <>
      <div className={cssClass}>{task}</div>
      <div><button onClick={editClicked}>Edit</button></div>
      <div><button onClick={doneClicked} disabled={completed}>Mark as Completed</button></div>
      <div><button onClick={removeClicked}>X</button></div>
    </>
  )
}

export default Task
