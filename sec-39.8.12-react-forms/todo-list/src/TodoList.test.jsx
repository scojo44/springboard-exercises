import { render, fireEvent } from '@testing-library/react';
import TodoList from './TodoList';

describe('TodoList Tests', () => {
  it('renders without crashing', () => {
    render(<TodoList />);
  });

  it('matches snapshot', () => {
    const {asFragment} = render(<TodoList />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('TodoList - Add/Remove Todo Tests', () => {
  function createTodo() {
  const {container, getByText, getByLabelText} = render(<TodoList />);
  const task = getByLabelText('Task:');
  const button = getByText('Add Todo');
  
  // Confirm no todos displayed
  expect(container.querySelectorAll('.Todo').length).toBe(0);
  
  // Create a todo
  fireEvent.change(task, {target: {value: 'Learn TypeScript'}});
  fireEvent.click(button);
  
  return {container, getByText, getByLabelText};
  }
  
  it('creates a new todo and adds it to the list', () => {
    const {container} = createTodo();
    const todo = container.querySelector('.Todo');

    expect(container.querySelectorAll('.Todo').length).toBe(1);
    expect(container.querySelector('.TodoList ul')).toContainElement(todo);
    expect(todo).toHaveTextContent('Learn TypeScript');
  })
  
  it('removes the new todo when the X button is clicked', () => {
    const {container, getByText} = createTodo();
    const removeButton = getByText('X');

    fireEvent.click(removeButton);

    expect(container.querySelectorAll('.Todo').length).toBe(0);
  });
});
