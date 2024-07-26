import {render} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import {dogs} from './dogs.json'
import NavBar from './NavBar'

describe('NavBar Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <NavBar dogNames={dogs.map(d => d.name)} />
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <NavBar dogNames={dogs.map(d => d.name)} />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
