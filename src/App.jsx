import Header from './components/Header';
import Words from './components/Words';

const App = () => {
  return (
    <div className="mx-auto max-w-175 p-12.5">
      <Header />
      <Words />

      <footer>
        <p className="my-3.75">
          Results are from&nbsp;
          <a
            className="link link-primary"
            href="https://randomlexicon.com/api-reference"
          >
            randomlexicon.com
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
