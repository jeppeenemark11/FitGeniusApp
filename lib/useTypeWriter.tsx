import { useState, useEffect } from 'react';

const useTypewriter = (text: string, speed: number = 50, onComplete: () => void = () => {}) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {


    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.substring(0, index + 1));
      index++;
      if (index === text.length) {
        clearInterval(intervalId);
        onComplete();
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed ]);

  return displayedText;
};

export default useTypewriter;
