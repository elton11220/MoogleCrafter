declare namespace Eorzea {
  interface ItemUICategory {
    id: number;
    name: string;
  }

  interface Item {
    id: number;
    name: string;
    description: string;
    icon: number;
    itemUICategory: ItemUICategory;
  }

  interface GatheringItemLevelConvertTable {
    id: number;
    gatheringItemLevel: number;
    stars: number;
  }

  interface GatheringItem {
    id: number;
    item: Item;
    gatheringItemLevel: GatheringItemLevelConvertTable;
    enabled: boolean;
    isHidden: boolean;
  }

  interface GatheringType {
    id: number;
    name: string;
  }

  interface ExportedGatheringPoint {
    id: number;
    x: number;
    y: number;
    gatheringType: GatheringType;
    radius: number;
    coordConverted: number;
  }

  interface GatheringPointBase {
    id: number;
    gatheringType: GatheringType;
    gatheringLevel: number;
    items: Item | null;
  }

  interface GatheringPointBonusType {
    id: number;
    text: string;
  }

  interface GatheringCondition {
    id: number;
    text: string;
  }

  interface GatheringPointBonus {
    id: number;
    condition: GatheringCondition;
    conditionValueFrom: number;
    conditionValueTo: number;
    bonusType: GatheringPointBonusType;
    bonusValueFrom: number;
    bonusValueTo: number;
  }

  interface GatheringRarePopTimeTable {
    id: number;
    startTime0: number;
    duration0: number;
    startTime1: number;
    duration1: number;
    startTime2: number;
    duration2: number;
  }

  interface GatheringPointTransient {
    id: number;
    ephemeralStartTime: number;
    ephemeralEndTime: number;
    gatheringRarePopTimeTable: GatheringRarePopTimeTable;
  }

  interface ClassJob {
    id: number;
    name: string;
  }

  interface GatheringSubCategory {
    id: number;
    gatheringType: GatheringType;
    classJob: ClassJob;
    folkloreBook: string;
  }

  interface PlaceName {
    id: number;
    name: string;
  }

  interface Map {
    id: number;
    mapId: string;
    placeNameForRegion: PlaceName;
    placeName: PlaceName;
    sizeFactor: number;
    offsetX: number;
    offsetY: number;
  }

  interface ExVersion {
    id: number;
    name: string;
  }

  interface TerritoryType {
    id: number;
    name: string;
    placeNameForRegion: PlaceName;
    placeNameForZone: PlaceName;
    placeName: PlaceName;
    map: Map;
    exVersion: ExVersion;
  }

  interface GatheringPoint {
    id: number;
    gatheringPointBase: GatheringPointBase;
    gatheringPointBonus0: GatheringPointBonus;
    gatheringPointBonus1: GatheringPointBonus;
    placeName: PlaceName;
    territoryType: TerritoryType;
    gatheringSubCategory: GatheringSubCategory;
  }
}

declare namespace AppGlobal {
  type GatheringListItem = Pick<
    Eorzea.GatheringItem,
    'id' | 'gatheringItemLevel'
  > &
    Pick<Eorzea.Item, 'name' | 'icon'> &
    Omit<Eorzea.GatheringRarePopTimeTable, 'id'> &
    Pick<Eorzea.ExportedGatheringPoint, 'x' | 'y' | 'coordConverted'> & {
      placeName: Pick<Eorzea.PlaceName, 'name'>;
      classJob: Pick<Eorzea.ClassJob, 'name'>;
    };

  interface GatheringItem {
    id: number;
    name: string;
    icon: number;
    exVersion: number;
    folkloreBook: string | null;
    gatheringItemLevel: number;
    gatheringItemStars: number;
    gatheringPoints: GatheringPoint[];
  }

  interface GatheringPoint {
    classJob: string | null;
    gatheringPointBaseId: number;
    gatheringPointBonus: GatheringPointBonus[];
    gatheringType: number;
    mapId: number;
    mapSymbol: string;
    placeName: string;
    timeTable: TimeTable[];
    x: number;
    y: number;
  }

  interface GatheringPointBonus {
    bonusType: string;
    condition: string;
  }

  interface TimeTable {
    duration: number;
    startTime: number;
  }
}
