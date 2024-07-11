import { render, fireEvent } from '@testing-library/react';
import Todo from './Todo';

describe('Todo Tests', () => {
  it('renders without crashing', () => {
    render(<Todo id={1} task="Learn React" removeMe={x => true} />);
  });

  it('matches snapshot', () => {
    const {asFragment} = render(<Todo id={1} task="Learn React" removeMe={x => true} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('shows a task with a remove button', () => {
    const {getByText} = render(<Todo id={1} task="Learn React" removeMe={x => true} />);
    const task = getByText('Learn React');
    const button = getByText('X');

    expect(task).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('should call the passed remove function', () => {
    const remove = vitest.fn();
    const {getByText} = render(<Todo id={1} task="Learn React" removeMe={remove} />);
    const button = getByText('X');

    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(remove).toHaveBeenCalled();
  });
});
