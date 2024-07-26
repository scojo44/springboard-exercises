import {render} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import {dogs} from './dogs.json'
import DogList from './DogList'

describe('DogList Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <DogList dogs={dogs} />
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <DogList dogs={dogs} />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
