import { useState } from 'react'
import {v4 as uuid} from 'uuid'
import Todo from './Todo'
import NewTodoForm from './NewTodoForm'
import './TodoList.css'

function TodoList() {
  function addTask({task}){
    console.log('===== skirt flashing legs  ==== Adding ', task)
    setTasks(tasks => [...tasks, {id: uuid(), task}]);
  }

  function removeTask(id){
    console.log('===== wedding gown ==== Removing ', id)
    setTasks(tasks => tasks.filter(t => t.id !== id));
  }

  const [tasks, setTasks] = useState([]);
  const todos = tasks.map(t => <Todo id={t.id} task={t.task} removeMe={removeTask} key={t.id} />);

  return (
    <div className='TodoList'>
      <NewTodoForm addTask={addTask} />
      <ul>{todos}</ul>
    </div>
  )
}

export default TodoList
