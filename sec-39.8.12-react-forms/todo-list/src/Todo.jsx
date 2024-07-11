import { useState } from 'react'
import './Todo.css'

function Todo({id, task, removeMe}) {
  function handldClick(e) {
    console.log('==== crinoline ====', id, task);
    removeMe(id);
  }

  return (
    <li className='Todo'>
      {task}
      <button onClick={handldClick}>X</button>
    </li>
  )
}

export default Todo
