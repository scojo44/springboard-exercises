import React, { useState } from 'react'
import './TaskEdit.css'

function TaskEdit({id, task, update}) {
  /** Send the updated todo to the parent */
  function handleSubmit(e) {
    update(id, newTask, false);
    setNewTask(() => '');
  }

  function handleChange(e) {
    setNewTask(() => e.target.value);
  }

  const [newTask, setNewTask] = useState(task);

  return (
    <form onSubmit={handleSubmit} className='TaskEdit'>
      <input type="text" name="edit" id="edit" value={newTask} onChange={handleChange} />
      <button>Save</button>
    </form>
  )
}

export default TaskEdit
