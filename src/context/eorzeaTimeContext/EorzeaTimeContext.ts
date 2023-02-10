import {createContext} from 'react';
import {computeEorzeaDate} from '../../utils/eorzeaTime';

const now = new Date();

const EorzeaTimeContext = createContext({
  currentEt: computeEorzeaDate(now), // current Eorzea Time
  currentLt: now, // current Local Time
});

EorzeaTimeContext.displayName = 'EorzeaTimeContext';

export const EorzeaTimeProvider = EorzeaTimeContext.Provider;
export const EorzeaTimeConsumer = EorzeaTimeContext.Consumer;
export {EorzeaTimeContext};
