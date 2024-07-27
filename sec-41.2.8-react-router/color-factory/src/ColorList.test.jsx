import {render} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ColorList from './ColorList'

const TEST_COLORS = [
  {
    id: 1,
    name: 'purple',
    value: '#FF00FF'
  }
]

describe('ColorList Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <ColorList colors={TEST_COLORS} />
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <ColorList colors={TEST_COLORS} />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
