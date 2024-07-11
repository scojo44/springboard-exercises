import React from 'react'

function Task({id, task, remove, update }) {
  /** Have TodoList know remove the todo from the list */
  function removeClicked(e) {
    remove(id);
  }

  /** Let TodoList know this todo is being edited */
  function editClicked(e) {
    update(id, task, true);
  }

  return (
    <>
      <div>{task}</div>
      <div><button onClick={editClicked}>Edit</button></div>
      <div><button onClick={removeClicked}>X</button></div>
    </>
  )
}

export default Task
