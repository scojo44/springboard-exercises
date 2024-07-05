const App = () => (
  <div>
    <FirstComponent />
    <NamedComponent name='xyzzy' />
  </div>
);

// Using React 18 syntax
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
