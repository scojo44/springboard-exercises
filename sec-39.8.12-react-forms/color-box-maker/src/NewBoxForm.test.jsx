import { render, fireEvent, queryByLabelText } from '@testing-library/react';
import NewBoxForm from './NewBoxForm';

describe('NewBoxForm Tests', () => {
  it('renders without crashing', () => {
    render(<NewBoxForm addBox={x => true} />);
  });

  it('matches snapshot', () => {
    const {asFragment} = render(<NewBoxForm addBox={x => true} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('shows the form', () => {
    const {getByLabelText} = render(<NewBoxForm addBox={x => true} />);
    const color = getByLabelText('Color:');
    const width = getByLabelText('Width:');
    const height = getByLabelText('Height:');
    expect(color).toBeInTheDocument();
    expect(width).toBeInTheDocument();
    expect(height).toBeInTheDocument();
  });

  it('submits the form, and calls the parent function with the formData', () => {
    let newBox = null;
    const addBox = vitest.fn(formData => {
      newBox = formData;
    });
    const {getByText, getByLabelText} = render(<NewBoxForm addBox={addBox} />);
    const color = getByLabelText('Color:');
    const width = getByLabelText('Width:');
    const height = getByLabelText('Height:');
    const button = getByText('Add Box');
    fireEvent.change(color, {target: {value: 'pink'}});
    fireEvent.change(width, {target: {value: '1em'}});
    fireEvent.change(height, {target: {value: '1em'}});
    fireEvent.click(button);
    expect(addBox).toHaveBeenCalled();
    expect(newBox).toEqual({
      color: 'pink',
      width: '1em',
      height: '1em'
    });
  });
});
