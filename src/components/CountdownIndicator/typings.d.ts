import type {IndicatorType} from '.';

declare namespace CountdownIndicatorTypes {
  interface Props {
    value: string;
    type: IndicatorType;
    activated: boolean;
  }
}

export {CountdownIndicatorTypes};
