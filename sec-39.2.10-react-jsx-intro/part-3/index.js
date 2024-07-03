const App = () => (
  <div>
    <Alert category="success" message="Added three people!" />
    <hr />
    <Person name="Bob" age="32" hobbies={[[1, 'Geocaching'], [2, 'Jigsaw Puzzles'], [3, 'Genealogy']]} />
    <Person name="Kimberly" age="24" hobbies={[[1, 'Crocheting'], [2, 'Quilting'], [3, 'Birdwatching']]} />
    <Person name="Johnny" age="15" hobbies={[[1, 'Programming'], [2, 'Board Games'], [3, 'Model Airplanes']]} />
  </div>
);

// Using React 18 syntax
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App/>);
