declare namespace AppGlobal {
  interface GatheringItem {
    id: number;
    name: string;
    icon: number;
    exVersion: number;
    itemCategory: string;
    folkloreBook: string | null;
    gatheringItemLevel: number;
    gatheringItemStars: number;
    gatheringPoints: GatheringPoint[];
    isRare: boolean;
    isHidden: boolean;
  }

  interface GatheringPoint {
    classJob: string | null;
    gatheringPointBaseId: number;
    gatheringPointBonus: GatheringPointBonus[];
    gatheringType: number;
    mapId: number;
    mapSymbol: string;
    placeName: string;
    placeNameForAetheryte: string;
    timeTable: RawTimeTable[];
    x: number;
    y: number;
  }

  interface GatheringPointBonus {
    bonusType: string;
    condition: string;
  }

  interface RawTimeTable {
    duration: number;
    startTime: number;
  }

  interface TimeTableItem {
    startTime: number;
    duration: number;
    gatheringPointIndex: number;
    gatheringPointBaseId: number;
  }

  interface RegionItem {
    maps: RegionMap[];
    regionName: string;
  }

  interface RegionMap {
    hierarchy: number;
    id: string;
    key: number;
    name: string;
    regionName: string;
    subName: string;
  }

  interface GatheringPointBaseItem {
    id: number;
    name: string;
    icon: number;
    gatheringItemLevel: number;
    gatheringItemStars: number;
    isHidden: boolean;
  }

  type GatheringPointBase = GatheringPointBaseItem[];
}
