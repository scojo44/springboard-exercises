import { render } from '@testing-library/react';
import App from './App';

describe('App Tests', () => {
  it('renders without crashing', () => {
    render(<App />);
  });

  it('matches snapshot', () => {
    const {asFragment} = render(<App />);
    expect(asFragment()).toMatchSnapshot();
  });
});
