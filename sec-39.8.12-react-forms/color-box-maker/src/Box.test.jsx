import { render } from '@testing-library/react';
import Box from './Box';

describe('Box Tests', () => {
  it('renders without crashing', () => {
    render(<Box color="mediumpurple" width="100px" height="100px" removeMe={x => true} />);
  });

  it('matches snapshot', () => {
    const {asFragment} = render(<Box color="mediumpurple" width="100px" height="100px" removeMe={x => true} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('shows the remove button', () => {
    const {getByText} = render(<Box color="mediumpurple" width="100px" height="100px" removeMe={x => true} />);
    const button = getByText('X');
    expect(button).toBeInTheDocument();
  });
});
