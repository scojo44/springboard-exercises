import { render } from "@testing-library/react";
import Board from "./Board";

it('renders without crashing', () => {
  render(<Board rows={3} cols={3} chanceLightStartsOn={1} />);
});

it('matches the snapshot', () => {
  const {asFragment} = render(<Board rows={3} cols={3} chanceLightStartsOn={1} />);
  expect(asFragment()).toMatchSnapshot();
});
