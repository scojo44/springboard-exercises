import { useState } from 'react'
import {v4 as uuid} from 'uuid'
import Todo from './Todo'
import NewTodoForm from './NewTodoForm'
import './TodoList.css'

function TodoList() {
  function addTask({task}) {
    setTasks(tasks => [...tasks, {id: uuid(), task, completed: false}]);
  }

  function removeTask(id) {
    setTasks(tasks => tasks.filter(t => t.id !== id));
  }

  /** editing is true: Show the todo edit UI
   * editing is false: Update the task from the edit form
   */
  function updateTask(id, task, completed, editing = false) {
    setTasks(tasks => tasks.map(t => {
      if(t.id === id) {
        t.task = task;
        t.completed = completed;
        t.editing = editing;
      }
      return t;
    }));
  }

  const [tasks, setTasks] = useState([]);
  const todos = tasks.map(t => <Todo id={t.id} task={t.task} remove={removeTask} update={updateTask} completed={t.completed} editing={t.editing} key={t.id} />);

  return (
    <div className='TodoList'>
      <NewTodoForm addTask={addTask} />
      <ul>{todos}</ul>
    </div>
  )
}

export default TodoList
