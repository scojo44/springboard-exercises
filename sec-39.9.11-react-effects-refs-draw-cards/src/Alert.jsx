import React from "react"
import './Alert.css'

const Alert = ({category, message}) => (
  <p className={"Alert " + category}>{message}</p>
);

export default Alert
