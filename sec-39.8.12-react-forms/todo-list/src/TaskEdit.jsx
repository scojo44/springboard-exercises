import React, { useState } from 'react'
import './TaskEdit.css'

function TaskEdit({id, task, update, completed}) {
  /** Send the updated task to the parent */
  function handleSubmit(e) {
    update(id, newTask, completed, false);
    setNewTask(() => '');
  }

  function handleChange(e) {
    setNewTask(() => e.target.value);
  }

  const [newTask, setNewTask] = useState(task);

  return (
    <form onSubmit={handleSubmit} className='TaskEdit'>
      <div><input type="text" name="edit" id="edit" value={newTask} onChange={handleChange} /></div>
      <button>Save</button>
    </form>
  )
}

export default TaskEdit
