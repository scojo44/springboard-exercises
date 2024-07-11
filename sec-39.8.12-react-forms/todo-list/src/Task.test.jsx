import { render, fireEvent } from '@testing-library/react';
import Task from './Task';

describe('Task Tests', () => {
  it('renders without crashing', () => {
    render(<Task id={1} task="Learn Docker" />);
  });

  it('matches snapshot', () => {
    const {asFragment} = render(<Task id={1} task="Learn Docker" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('shows a task with Edit and Remove buttons', () => {
    const {getByText} = render(<Task id={1} task="Learn Docker" remove={x => x} update={x => x} />);
    const task = getByText('Learn Docker');
    const editButton = getByText('Edit');
    const removeButton = getByText('X');

    expect(task).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();
    expect(removeButton).toBeInTheDocument();
  });

  it('should call the passed remove function when X is clicked', () => {
    const remove = vitest.fn();
    const {getByText} = render(<Task id={1} task="Learn Docker" remove={remove} />);
    const button = getByText('X');

    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(remove).toHaveBeenCalledWith(1);
  });

  it('should call the passed update function when Edit is clicked', () => {
    const update = vitest.fn();
    const {getByText} = render(<Task id={1} task="Learn Docker" update={update} />);
    const button = getByText('Edit');

    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(update).toHaveBeenCalledWith(1, "Learn Docker", true);
  });
});
