import {useEffect, useState} from 'react';
import {computeEorzeaDate} from '../../utils/eorzeaTime';

export default function useEorzeaTimeProvider(interval: number = 1000) {
  const [eorzeaTime, setEorzeaTime] = useState({
    currentEt: computeEorzeaDate(new Date()),
    currentLt: new Date(),
  });
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setEorzeaTime({
        currentEt: computeEorzeaDate(now),
        currentLt: now,
      });
    }, interval);
    return () => {
      clearInterval(timer);
    };
  }, [interval]);
  return eorzeaTime;
}
