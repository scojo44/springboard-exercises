import React, { useState } from 'react'
import Task from './Task'
import TaskEdit from './TaskEdit'
import './Todo.css'

function Todo({id, task, remove, update, editing = false}) {
  return (
    <li className='Todo'>
      {editing
      ? <TaskEdit id={id} task={task} update={update} />
      : <Task id={id} task={task} remove={remove} update={update} />
      }
    </li>
  )
}

export default Todo
