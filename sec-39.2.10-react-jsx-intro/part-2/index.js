const App = () => (
  <div>
    <Tweet username="scott" name="Scott" date={new Date(2024,4,1)} message="Trying out React" />
    <Tweet username="xyzzy" name="Xyzzy" date={new Date(2024,5,3)} message="Nothing happens" />
    <Tweet username="link"  name="Link"  date={new Date(2024,6,9)} message="Found another piece of the Triforce!" />
  </div>
);

// Using React 18 syntax
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App/>);
