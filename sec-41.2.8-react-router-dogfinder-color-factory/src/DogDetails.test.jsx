import {render} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RouteList from './RouteList'
import DogDetails from './DogDetails'
import {dogs} from './dogs.json'

vi.mock('react-router-dom', async () => {
  return {
    ...await vi.importActual('react-router-dom'),
    useParams: () => ({id: 'duke'})
  };
});

describe('DogDetails Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <DogDetails dogs={dogs} />
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <DogDetails dogs={dogs} />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('Shows dog details', () => {
    const {getByText} = render(
      <MemoryRouter>
        <DogDetails dogs={dogs} />
      </MemoryRouter>
    );
    expect(getByText('Duke')).toBeInTheDocument();
    expect(getByText('Age: 3')).toBeInTheDocument();
    expect(getByText('Duke likes snow.')).toBeInTheDocument();
  });
});
