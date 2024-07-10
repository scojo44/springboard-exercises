import { render, fireEvent } from '@testing-library/react';
import BoxList from './App';

describe('BoxList Tests', () => {
  it('renders without crashing', () => {
    render(<BoxList />);
  });

  it('matches snapshot', () => {
    const {asFragment} = render(<BoxList />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('BoxList - Add/Remove Box Tests', () => {
  function createBox() {
    const {container, getByText, getByLabelText} = render(<BoxList />);
    const color = getByLabelText('Color:');
    const width = getByLabelText('Width:');
    const height = getByLabelText('Height:');
    const button = getByText('Add Box');

    // Confirm no boxes displayed
    expect(container.querySelectorAll('.Box').length).toBe(0);

    // Create a box
    fireEvent.change(color, {target: {value: 'thistle'}});
    fireEvent.change(width, {target: {value: '100px'}});
    fireEvent.change(height, {target: {value: '100px'}});
    fireEvent.click(button);

    return {container, getByText, getByLabelText};
  }

  it('creates a new box and adds it to the list', () => {
    const {container} = createBox();
    const box = container.querySelector('.Box div');
    expect(container.querySelectorAll('.Box').length).toBe(1);
    expect(container.querySelector('.BoxList ul')).toContainElement(box);
    expect(box).toHaveStyle({backgroundColor: '#D8BFD8'}); // thistle
    expect(box).toHaveStyle({width: "100px"});
    expect(box).toHaveStyle({height: "100px"});
  })

  it('removes the new box when the X button is clicked', () => {
    const {container, getByText} = createBox();
    const box = container.querySelector('.Box div');
    const removeButton = getByText('X');
    fireEvent.click(removeButton);
    expect(container.querySelectorAll('.Box').length).toBe(0);
  });
});
