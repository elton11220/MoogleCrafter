import {useContext} from 'react';
import {EorzeaTimeContext} from './EorzeaTimeContext';

export default function useEorzeaTime() {
  const context = useContext(EorzeaTimeContext);
  return context;
}
