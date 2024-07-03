const App = () => (
  <div>
    <Alert type="success" message="Added three people!" />
    <hr />
    <Person name="Bob" age="32" hobbies={['Geocaching', "Jigsaw Puzzles", "Genealogy"]} />
    <Person name="Kimberly" age="24" hobbies={['Crocheting', "Quilting", "Birdwatching"]} />
    <Person name="Johnny" age="15" hobbies={['Programming', "Board Games", "Model Airplanes"]} />
  </div>
);

// Using React 18 syntax
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App/>);
