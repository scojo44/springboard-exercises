import {render, fireEvent} from "@testing-library/react";
import Board from "./Board";

it('renders without crashing', () => {
  render(<Board rows={3} cols={3} chanceLightStartsOn={1} />);
});

it('matches the snapshot', () => {
  const {asFragment} = render(<Board rows={3} cols={3} chanceLightStartsOn={1} />);
  expect(asFragment()).toMatchSnapshot();
});

it('toggles the correct lights when the center light in a 3x3 board is clicked', () => {
  function expectLightToBeOn(y, x) {
    const light = container.querySelector(`.Board tr:nth-child(${y}) td:nth-child(${x})`);
    expect(light).toHaveClass('Light-lit');
  }

  function expectLightToBeOff(y, x) {
    const light = container.querySelector(`.Board tr:nth-child(${y}) td:nth-child(${x})`);
    expect(light).not.toHaveClass('Light-lit');
  }

  // Make sure all the lights are off
  const {container, debug} = render(<Board rows={3} cols={3} chanceLightStartsOn={1} />);
  expectLightToBeOn(1,1);
  expectLightToBeOn(1,2);
  expectLightToBeOn(1,3);
  expectLightToBeOn(2,1);
  expectLightToBeOn(2,2);
  expectLightToBeOn(2,3);
  expectLightToBeOn(3,1);
  expectLightToBeOn(3,2);
  expectLightToBeOn(3,3);
  
  // Click the center light and check that a plus shape of lights are off
  const light = container.querySelector('.Board tr:nth-child(2) td:nth-child(2)');
  fireEvent.click(light);
  expectLightToBeOn(1,1);
  expectLightToBeOff(1,2);
  expectLightToBeOn(1,3);
  expectLightToBeOff(2,1);
  expectLightToBeOff(2,2);
  expectLightToBeOff(2,3);
  expectLightToBeOn(3,1);
  expectLightToBeOff(3,2);
  expectLightToBeOn(3,3);
});

it('toggles the correct lights when upper right light in a 3x3 board is clicked', () => {
  function expectLightToBeOn(x, y) {
    const light = container.querySelector(`.Board tr:nth-child(${y}) td:nth-child(${x})`);
    expect(light).toHaveClass('Light-lit');
  }

  function expectLightToBeOff(x, y) {
    const light = container.querySelector(`.Board tr:nth-child(${y}) td:nth-child(${x})`);
    expect(light).not.toHaveClass('Light-lit');
  }

  // Make sure all the lights are off
  const {container} = render(<Board rows={3} cols={3} chanceLightStartsOn={1} />);
  expectLightToBeOn(1,1);
  expectLightToBeOn(1,2);
  expectLightToBeOn(1,3);
  expectLightToBeOn(2,1);
  expectLightToBeOn(2,2);
  expectLightToBeOn(2,3);
  expectLightToBeOn(3,1);
  expectLightToBeOn(3,2);
  expectLightToBeOn(3,3);
  
  // Click the light and check that the upper-right corner of three lights are off
  const light = container.querySelector('.Board tr:first-child td:first-child');
  fireEvent.click(light);
  expectLightToBeOff(1,1);
  expectLightToBeOff(1,2);
  expectLightToBeOn(1,3);
  expectLightToBeOff(2,1);
  expectLightToBeOn(2,2);
  expectLightToBeOn(2,3);
  expectLightToBeOn(3,1);
  expectLightToBeOn(3,2);
  expectLightToBeOn(3,3);
});

it('shows the winner message when all the lights are off', () => {
  const {getByText} = render(<Board rows={3} cols={3} chanceLightStartsOn={0} />);
  const winner = getByText("You Won!");
  expect(winner).toHaveClass("Board");
  expect(winner).toHaveTextContent("You Won!");
});
