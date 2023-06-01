declare namespace ShowMore {
  interface Props {
    unfold: boolean;
    onChange: (value: boolean) => void;
    foldText?: string;
    unfoldText?: string;
  }
}
