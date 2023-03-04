import type {IndicatorType} from '.';

declare namespace CountdownIndicatorTypes {
  interface Props {
    value: string;
    type: IndicatorType;
    activated: boolean;
    theme?: 'light' | 'dark';
  }
}

export {CountdownIndicatorTypes};
