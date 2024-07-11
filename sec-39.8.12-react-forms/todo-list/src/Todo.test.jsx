import { render, fireEvent } from '@testing-library/react';
import Todo from './Todo';

describe('Todo Tests', () => {
  it('renders without crashing', () => {
    render(<Todo id={1} task="Learn React" />);
  });

  it('matches snapshot', () => {
    const {asFragment} = render(<Todo id={1} task="Learn React" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('shows a task', () => {
    const {getByText} = render(<Todo id={1} task="Learn React" remove={x => x} update={x => x} />);
    const task = getByText('Learn React');
    expect(task).toBeInTheDocument();
  });

  it('shows a task in editing mode', () => {
    const {getByText} = render(<Todo id={1} task="Learn React" editing={true} />);
    const button = getByText('Save');

    expect(button).toBeInTheDocument();
  });
});
