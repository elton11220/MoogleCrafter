declare namespace GatheringList {
  interface Props {
    data: AppGlobal.GatheringItem[];
    onSelected: (item: AppGlobal.GatheringItem) => void;
    onCancelSelection: (itemId: AppGlobal.GatheringItem['id']) => void;
    selectedItems: Map<AppGlobal.GatheringItem['id'], AppGlobal.GatheringItem>;
  }
}
