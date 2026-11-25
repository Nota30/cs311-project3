import { useEffect, useRef, useState } from 'react';
import { annotate } from 'rough-notation';
import Row from './Row';

const API_URL = 'https://randomlexicon.com/api';
const FILTERS = ['all', 'noun', 'verb', 'adj', 'adv'];

const Words = () => {
  const [words, setWords] = useState([]);
  const [filter, setFilter] = useState('all');

  const [search, setSearch] = useState('');
  const [found, setFound] = useState([]);
  const [showing, setShowing] = useState(false);

  const [message, setMessage] = useState('nothing here yet....');
  const [isError, setIsError] = useState(false);

  const aboutRef = useRef(null);
  const messageRef = useRef(null);

  useEffect(() => {
    const brackets = annotate(aboutRef.current, {
      type: 'bracket',
      brackets: ['left', 'right'],
      color: '#34d399',
    });
    brackets.show();
    return () => brackets.remove();
  }, []);

  useEffect(() => {
    if (!isError) return;

    const underline = annotate(messageRef.current, {
      type: 'underline',
      color: '#ff0000',
    });

    underline.show();

    return () => underline.remove();
  }, [isError, message]);

  const fetchWords = async () => {
    setShowing(false);
    setWords([]);
    setIsError(false);
    setMessage('generating....');

    try {
      const requests = [];
      for (let i = 0; i < 20; i++) {
        requests.push(
          fetch(`${API_URL}/random-definition`).then((response) =>
            response.json(),
          ),
        );
      }

      const data = await Promise.all(requests);

      setWords(data);
      setMessage(`All 20 words have been generated`);
    } catch (err) {
      setIsError(true);
      setMessage(`an error occurred: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const searchWord = async () => {
    const term = search.trim();
    setShowing(true);
    setFound([]);

    if (term === '') {
      setIsError(true);
      setMessage('no word was entered...');
      return;
    }

    setIsError(false);
    setMessage('searching...');

    try {
      const response = await fetch(
        `${API_URL}/words/${encodeURIComponent(term)}`,
      );
      const data = await response.json();

      if (data.entries.length === 0) {
        setIsError(true);
        setMessage("word couldn't be found...");
        return;
      }

      setFound(data.entries);
      setMessage(`Results for "${term}"`);
    } catch (err) {
      setIsError(true);
      setMessage(`an error occurred: ${err.message}`);
    }
  };

  const filteredWords =
    filter === 'all' ? words : words.filter((word) => word.pos === filter);

  return (
    <main>
      <section className="mb-13.75">
        <h2 className="mt-[0.83em] mb-3.75 text-[14px] font-medium text-white">
          <span ref={aboutRef}>About</span>
        </h2>
        <p className="my-3.75">
          Click the button below to generate 20 random words and their
          definitions. <br />
          Or use the search field to find a definition.
        </p>

        <div className="flex flex-wrap gap-1">
          <button
            className="btn btn-sm btn-outline border-base-300 text-[15px] font-normal text-white hover:border-white hover:bg-transparent"
            onClick={fetchWords}
          >
            Generate words
          </button>
          <input
            type="text"
            className="input input-sm w-auto border-base-300 text-[15px] text-white focus:border-white focus:outline-none"
            placeholder="Search a word"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="btn btn-sm btn-outline border-base-300 text-[15px] font-normal text-white hover:border-white hover:bg-transparent"
            onClick={searchWord}
          >
            Search
          </button>
        </div>
      </section>

      <section className="mb-13.75">
        <h2 className="mt-[0.83em] mb-3.75 text-[14px] font-medium text-white">
          Words
        </h2>

        {!showing && words.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {FILTERS.map((pos) => (
              <button
                key={pos}
                className={
                  filter === pos
                    ? 'btn btn-sm btn-outline btn-primary text-[15px] font-normal'
                    : 'btn btn-sm btn-outline border-base-300 text-[15px] font-normal text-white hover:border-white hover:bg-transparent'
                }
                onClick={() => setFilter(pos)}
              >
                {pos}
              </button>
            ))}
          </div>
        )}

        <p className={isError ? 'my-3.75 text-error' : 'my-3.75'}>
          <span ref={messageRef}>{message}</span>
        </p>

        {showing
          ? found.map((entry) => (
              <Row key={entry.entryKey} label={entry.pos}>
                {entry.definitions[0].definition}
              </Row>
            ))
          : filteredWords.map((word, index) => (
              <Row
                key={`${word.reference.definitionKey}-${index}`}
                label={word.word}
              >
                <span>{word.pos}</span>
                <p className="my-3.75">{word.definition}</p>
              </Row>
            ))}

        {!showing && words.length > 0 && filteredWords.length === 0 && (
          <p className="my-3.75">no {filter} words in this list...</p>
        )}
      </section>
    </main>
  );
};

export default Words;
