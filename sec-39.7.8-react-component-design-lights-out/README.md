React Component Design - Lights Out
===================================

## My Design

Before seeing their design and reading the starter code:

App: Contains Grid

Grid: Show the grid of lights
- Props: width, height (grid size)
- State: [{x, y, lit}]
  - Have to be able to check if all the lights are off to determine if the game is won
- Function: toggleLights(x, y)
  - Toggles the litStatus of the light and its neighbors
  - Passed to lights

Light: Shows the light
- Props: litStatus, toggleLights, x y (location)
- OnClick: call toggleLights from parent Grid

## Further Study Items

- [x] Default Properties
  - React 18.3 deprecated defaultProps for function components in favor of JS default parameters.  Will be removed in React 19.
- [ ] Add Tests
- [ ] Improve Our CSS
- [ ] Ensure A Game Is Winnable
