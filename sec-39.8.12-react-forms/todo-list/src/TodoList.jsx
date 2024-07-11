import { useState } from 'react'
import {v4 as uuid} from 'uuid'
import Todo from './Todo'
import NewTodoForm from './NewTodoForm'
import './TodoList.css'

const TASKS_STORAGE_KEY = '39.8.12 Task List'

function TodoList() {
  function saveTasks(updatedTasks) {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
  }

  function addTask({task}) {
    tasks.push({id: uuid(), task, completed: false});
    saveTasks(tasks);
    setTasks(() => [...tasks]);
  }

  function removeTask(id) {
    const newTasks = tasks.filter(t => t.id !== id);
    saveTasks(newTasks);
    setTasks(() => [...newTasks]);
  }

  /** editing is true: Show the todo edit UI
   * editing is false: Update the task from the edit form
   */
  function updateTask(id, task, completed, editing = false) {
    const newTasks = tasks.map(t => {
      if(t.id === id) {
        t.task = task;
        t.completed = completed;
        t.editing = editing;
      }
      return t;
    });

    saveTasks(newTasks);
    setTasks(() => newTasks);
  }

  const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem(TASKS_STORAGE_KEY)) || []);
  const todos = tasks.map(t => <Todo id={t.id} task={t.task} remove={removeTask} update={updateTask} completed={t.completed} editing={t.editing} key={t.id} />);

  return (
    <div className='TodoList'>
      <NewTodoForm addTask={addTask} />
      <ul>{todos}</ul>
    </div>
  )
}

export default TodoList
