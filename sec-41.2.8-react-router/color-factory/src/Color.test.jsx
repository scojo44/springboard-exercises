import {render} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Color from './Color'

const TEST_COLORS = [
  {
    id: 1,
    name: 'purple',
    value: '#FF00FF'
  }
]

vi.mock('react-router-dom', async () => {
  return {
    ...await vi.importActual('react-router-dom'),
    useParams: () => ({color: 'purple'})
  };
});

describe('Color Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <Color colors={TEST_COLORS} />
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <Color colors={TEST_COLORS} />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
