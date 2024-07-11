import { render, fireEvent } from '@testing-library/react';
import TaskEdit from './TaskEdit';

describe('TaskEdit Tests', () => {
  it('renders without crashing', () => {
    render(<TaskEdit id={1} task="Learn Svelte" />);
  });

  it('matches snapshot', () => {
    const {asFragment} = render(<TaskEdit id={1} task="Learn Svelte" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should call the passed update function when Save is clicked', () => {
    const update = vitest.fn();
    const {getByText, getByDisplayValue} = render(<TaskEdit id={1} task="Learn Svelte" update={update} completed={false} />);
    const input = getByDisplayValue('Learn Svelte');
    const button = getByText('Save');

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    fireEvent.change(input, {target: {value: "Learn Preact"}})
    fireEvent.click(button);
    expect(update).toHaveBeenCalledWith(1, "Learn Preact", false, false);
  });
});
