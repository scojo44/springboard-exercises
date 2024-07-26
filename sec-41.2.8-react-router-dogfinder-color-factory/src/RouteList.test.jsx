import {render} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RouteList from './RouteList'

describe('RouteList Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <RouteList />
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <RouteList />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
