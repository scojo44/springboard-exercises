import {render, fireEvent} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NewColorForm from './NewColorForm'

describe('NewColorForm Tests', () => {
  const mockAddColor = vi.fn();

  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <NewColorForm addColor={mockAddColor} />
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <NewColorForm addColor={mockAddColor} />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('Calls the passed in function on submit', () => {
    const {getByText, getByLabelText} = render(
      <MemoryRouter>
        <NewColorForm addColor={mockAddColor} />
      </MemoryRouter>
    );
    const colorName = getByLabelText('Color Name:');
    const colorValue = getByLabelText('Color Value:');
    const button = getByText('Add Color');

    fireEvent.change(colorName, {target: {value: 'mediumpurple'}});
    fireEvent.change(colorValue, {target: {value: '#9370db'}});
    fireEvent.click(button);

    expect(mockAddColor).toHaveBeenCalledWith({
      id: expect.stringMatching(/[a-z0-9-]+/), // UUID
      name: 'mediumpurple',
      value: '#9370db'
    })
  });
});
