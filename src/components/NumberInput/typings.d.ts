declare namespace NumberInput {
  interface Props {
    value: number | null;
    setValue: (value: number | null) => void;
    min: number;
    max: number;
    step: number;
    clearable?: boolean;
  }
}
