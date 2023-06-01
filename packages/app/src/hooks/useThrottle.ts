import {useCallback, useRef} from 'react';

export default function useThrottle(fn: () => any, delay: number) {
  const timer = useRef<number | null>(null);
  const flag = useRef(false);
  const func = useCallback(() => {
    if (flag.current === false) {
      flag.current = true;
      fn();
      timer.current = setTimeout(() => {
        flag.current = false;
      }, delay);
    }
  }, [delay, fn]);
  return func;
}
