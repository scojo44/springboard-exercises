const App = () => (
  <div>
    <Alert type="success" message="Added three people!" />
    <hr />
    <Person name="Bob" age="32" hobbies={['Geocaching', "Jigsaw Puzzles", "Genealogy"]} />
    <Person name="Kimberly" age="24" hobbies={['Crocheting', "Quilting", "Birdwatching"]} />
    <Person name="Johnny" age="15" hobbies={['Programming', "Board Games", "Model Airplanes"]} />
  </div>
);

ReactDOM.render(<App/>, document.getElementById('root'));