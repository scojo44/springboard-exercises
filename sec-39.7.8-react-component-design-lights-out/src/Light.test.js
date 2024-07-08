import { render, fireEvent } from "@testing-library/react";
import Light from "./Light";

it('renders without crashing', () => {
  render(
    <table>
      <tbody>
        <tr>
          <Light islit={true} flipLightsAroundMe={e => console.log("Clicked!")} />
        </tr>
      </tbody>
    </table>
  );
});

it('matches the snapshot', () => {
  const {asFragment} = render(
    <table>
      <tbody>
        <tr>
          <Light islit={true} flipLightsAroundMe={e => console.log("Clicked!")} />
        </tr>
      </tbody>
    </table>
  );
  expect(asFragment()).toMatchSnapshot();
});
