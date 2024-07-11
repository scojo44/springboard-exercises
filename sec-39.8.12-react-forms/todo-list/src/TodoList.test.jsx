import { render, fireEvent, getByDisplayValue } from '@testing-library/react';
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
    const {container, getByText, queryByText, getByLabelText, getByDisplayValue} = render(<TodoList />);
    const task = getByLabelText('New Task:');
    const button = getByText('Add Todo');
    
    // Confirm no todos displayed
    expect(container.querySelectorAll('.Todo').length).toBe(0);
    
    // Create a todo
    fireEvent.change(task, {target: {value: 'Learn TypeScript'}});
    fireEvent.click(button);
    
    return {container, getByText, queryByText, getByLabelText, getByDisplayValue};
  }
  
  it('creates a new todo and adds it to the list', () => {
    const {container} = createTodo();
    const todo = container.querySelector('.Todo');

    expect(container.querySelectorAll('.Todo').length).toBe(1);
    expect(container.querySelector('.TodoList ul')).toContainElement(todo);
    expect(todo).toHaveTextContent('Learn TypeScript');
  })

  it('should make it through the toggle process', () => {
    const {getByText, getByLabelText} = createTodo();
    const label = getByText('Learn TypeScript');
    const checkbox = getByLabelText('Learn TypeScript');

    // New task should not be marked as done
    expect(checkbox).not.toBeChecked();
    expect(label).not.toHaveClass('done');

    // Check the box to mark as completed
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(label).toHaveClass('done');

    // Check the box again to unmark as completed
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(label).not.toHaveClass('done');
  });

  it('should make it through the task edit process', () => {
    const {container, getByText, queryByText, getByDisplayValue} = createTodo();
    const editButton = getByText('Edit');

    // Bring up the edit UI
    fireEvent.click(editButton);
    expect(queryByText('Edit')).toBeNull();
    expect(queryByText('X')).toBeNull();
    const input = getByDisplayValue('Learn TypeScript');
    const saveButton = getByText('Save');

    // Save the updated task
    fireEvent.change(input, {target: {value: 'Learn Next.js'}});
    fireEvent.click(saveButton);

    // Verify back to view UI
    expect(queryByText('Save')).toBeNull();
    expect(queryByText('Edit')).not.toBeNull();
    expect(queryByText('X')).not.toBeNull();
    const todo = container.querySelector('.Todo');
    expect(todo).toHaveTextContent('Learn Next.js');
  });

  it('removes the new todo when the X button is clicked', () => {
    const {container, getByText} = createTodo();
    const removeButton = getByText('X');

    fireEvent.click(removeButton);

    expect(container.querySelectorAll('.Todo').length).toBe(0);
  });
});
