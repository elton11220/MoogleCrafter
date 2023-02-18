import {useFocusEffect} from '@react-navigation/native';
import {useState} from 'react';
import {computeEorzeaDate} from '../utils/eorzeaTime';

export default function useEorzeaTimer(interval: number = 1000) {
  const [eorzeaTime, setEorzeaTime] = useState({
    currentEt: computeEorzeaDate(new Date()),
    currentLt: new Date(),
  });
  useFocusEffect(() => {
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
  });
  return eorzeaTime;
}
