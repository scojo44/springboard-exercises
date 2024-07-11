import React, {useState} from "react";

const EMPTY_FORM = {
  color: '',
  width: '',
  height: ''
};

const NewBoxForm = ({addBox}) => {
  function handleSubmit(e) {
    e.preventDefault();
    addBox(formData);
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
    <form onSubmit={handleSubmit} className="NewBoxForm">
      <p>
        <label htmlFor="color">Color: </label>
        <input type="text" id="color" name="color" value={formData.color} onChange={handleChange} />
      </p>
      <p>
        <label htmlFor="width">Width: </label>
        <input type="text" id="width" name="width" value={formData.width} onChange={handleChange} />
      </p>
      <p>
        <label htmlFor="height">Height: </label>
        <input type="text" id="height" name="height" value={formData.height} onChange={handleChange} />
      </p>
      <button type="submit">Add Box</button>
    </form>
  )
};

export default NewBoxForm;
