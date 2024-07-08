import { render, fireEvent } from "@testing-library/react";
import Card from "./Card";
import image1 from "./image1.jpg";

it('renders without crashing', () => {
  render(<Card caption="See any smoke?" src={image1} currNum={1} totalNum={1} />);
});

it('matches the snapshot', () => {
  const {asFragment} = render(<Card caption="Test Image" src={image1} currNum={1} totalNum={1} />);
  expect(asFragment()).toMatchSnapshot();
});
