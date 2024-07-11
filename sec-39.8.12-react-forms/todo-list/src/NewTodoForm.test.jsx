import { render, fireEvent, queryByLabelText } from '@testing-library/react';
import NewTodoForm from './NewTodoForm';

describe('NewTodoForm Tests', () => {
  it('renders without crashing', () => {
    render(<NewTodoForm addTask={x => true} />);
  });

  it('matches snapshot', () => {
    const {asFragment} = render(<NewTodoForm addTask={x => true} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('shows the form', () => {
    const {getByLabelText} = render(<NewTodoForm addTask={x => true} />);
    const task = getByLabelText('New Task:');
    expect(task).toBeInTheDocument();
  });

  it('submits the form, and calls the parent function with the formData', () => {
    const addTask = vitest.fn();
    const {getByText, getByLabelText} = render(<NewTodoForm addTask={addTask} />);
    const task = getByLabelText('New Task:');
    const button = getByText('Add Todo');

    fireEvent.change(task, {target: {value: 'Learn React'}});
    fireEvent.click(button);

    expect(addTask).toHaveBeenCalled();
    expect(addTask).toHaveBeenCalledWith({task: 'Learn React'});
  });
});
