import { render, fireEvent } from "@testing-library/react";
import Carousel from "./Carousel";
import TEST_IMAGES from "./_testCommon.js";

it('renders without crashing', () => {
  render(<Carousel photos={TEST_IMAGES} title="See any smoke?" />);
});

it('matches the snapshot', () => {
  const {asFragment} = render(<Carousel photos={TEST_IMAGES} title="Test Images" />);
  expect(asFragment()).toMatchSnapshot();
});

it("works when you click on the right arrow", () => {
  const { container } = render(
    <Carousel photos={TEST_IMAGES} title="images for testing" />
  );
  // expect the first image to show, but not the second
  expect(container.querySelector('img[alt="testing image 1"]')).toBeInTheDocument();
  expect(container.querySelector('img[alt="testing image 2"]')).not.toBeInTheDocument();

  // move forward in the carousel
  const rightArrow = container.querySelector(".bi-arrow-right-circle");
  fireEvent.click(rightArrow);

  // expect the second image to show, but not the first
  expect(container.querySelector('img[alt="testing image 1"]')).not.toBeInTheDocument();
  expect(container.querySelector('img[alt="testing image 2"]')).toBeInTheDocument();
});

it("works when you click on the left arrow", () => {
  const { container } = render(
    <Carousel photos={TEST_IMAGES} title="images for testing" />
  );
  // expect the first image to show, but not the second
  expect(container.querySelector('img[alt="testing image 1"]')).toBeInTheDocument();
  expect(container.querySelector('img[alt="testing image 2"]')).not.toBeInTheDocument();

  // move forward in the carousel
  const rightArrow = container.querySelector(".bi-arrow-right-circle");
  fireEvent.click(rightArrow);

  // expect the second image to show, but not the first
  expect(container.querySelector('img[alt="testing image 1"]')).not.toBeInTheDocument();
  expect(container.querySelector('img[alt="testing image 2"]')).toBeInTheDocument();

  // move backward in the carousel
  const leftArrow = container.querySelector(".bi-arrow-left-circle");
  fireEvent.click(leftArrow);

  // expect the first image to show again, and not the second
  expect(container.querySelector('img[alt="testing image 1"]')).toBeInTheDocument();
  expect(container.querySelector('img[alt="testing image 2"]')).not.toBeInTheDocument();
});

it("should hide the left arrow when on the first image", function() {
  const { container } = render(
    <Carousel photos={TEST_IMAGES} title="images for testing" />
  );
  expect(container.querySelector('.bi-arrow-left-circle')).not.toBeInTheDocument();
});

it("should hide the right arrow when on the last image", function() {
  const { container } = render(
    <Carousel photos={TEST_IMAGES} title="images for testing" />
  );

  // move forward to the third and last image in the carousel
  const rightArrow = container.querySelector(".bi-arrow-right-circle");
  fireEvent.click(rightArrow);
  fireEvent.click(rightArrow);
  expect(container.querySelector('.bi-arrow-right-circle')).not.toBeInTheDocument();
});
