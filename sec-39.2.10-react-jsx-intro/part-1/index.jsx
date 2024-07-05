const App = () => (
  <div>
    <FirstComponent />
    <NamedComponent name='xyzzy' />
  </div>
);

// Using React 18 syntax
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App/>);
