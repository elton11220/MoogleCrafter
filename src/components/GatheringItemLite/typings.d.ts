declare namespace GatheringItemLite {
  interface Props {
    data: AppGlobal.ItemBase;
    prefix?: string;
    showRightNavIcon?: boolean;
    onPress?: (id: number) => void;
  }
}
