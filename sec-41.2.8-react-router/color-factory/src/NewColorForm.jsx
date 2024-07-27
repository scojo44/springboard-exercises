import React, {useState} from "react"
import {v4 as uuid} from 'uuid'
import { useNavigate } from "react-router-dom"
import './NewColorForm.css'

const EMPTY_FORM = {
  name: '',
  value: ''
};

const NewColorForm = ({addColor}) => {
  const [color, setColor] = useState(EMPTY_FORM);
  const navigate = useNavigate();

  return (
    <form onSubmit={handleSubmit} className="NewColorForm">
      <p>
        <label htmlFor="name">Color Name: </label>
        <input type="text" id="name" name="name" onChange={handleChange} value={color.name} />
      </p>
      <p>
        <label htmlFor="value">Color Value: </label>
        <input type="color" id="value" name="value" onChange={handleChange} value={color.value} />
      </p>
      <p>
        <button type="submit">Add Color</button>
      </p>
    </form>
  );

  function handleSubmit(e) {
    addColor({id: uuid(), ...color});
    setColor(() => EMPTY_FORM);
    navigate('/colors');
  }

  function handleChange(e) {
    const {name, value} = e.target;
    setColor(color => ({
      ...color,
      [name]: value
    }));
  }
};

export default NewColorForm
