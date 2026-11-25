import { useEffect, useRef } from 'react';
import { annotate } from 'rough-notation';

const Header = () => {
  const titleRef = useRef(null);

  useEffect(() => {
    const highlight = annotate(titleRef.current, {
      type: 'highlight',
      color: 'rgba(52, 211, 153, 0.35)',
      multiline: true,
    });
    highlight.show();
    return () => highlight.remove();
  }, []);

  return (
    <header className="flow-root">
      <h1 className="my-[0.67em] text-[2em] font-bold text-white">
        <span ref={titleRef}>Random Words & Definition Generator</span>
      </h1>
      <p className="my-3.75">
        Discover new random words, their definitions and get definitions for any
        word you want.&nbsp;
        <a
          className="link link-primary"
          href="https://github.com/Nota30/cs311-project3"
        >
          Github
        </a>
      </p>
    </header>
  );
};

export default Header;
