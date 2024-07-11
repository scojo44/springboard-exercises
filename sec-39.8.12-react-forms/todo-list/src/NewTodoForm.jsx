import React, {useState} from "react";

const EMPTY_FORM = {
  task: ''
};

const NewTodoForm = ({addTask}) => {
  function handleSubmit(e) {
    e.preventDefault();
    addTask(formData);
    setFormData(() => {
      return {...EMPTY_FORM};
    });
  }

  function handleChange(e) {
    const {name, value} = e.target;

    setFormData(data => {
      return {
        ...data,
        [name]: value
      };
    })
  }

  const [formData, setFormData] = useState(EMPTY_FORM);

  return (
    <form onSubmit={handleSubmit} className="NewTodoForm">
      <p>
        <label htmlFor="task">Task: </label>
        <input type="text" id="task" name="task" value={formData.task} onChange={handleChange} />
      </p>
      <button type="submit">Add Todo</button>
    </form>
  )
};

export default NewTodoForm;
