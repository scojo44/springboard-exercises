const App = () => (
  <div>
    <FirstComponent />
    <NamedComponent name='xyzzy' />
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));
