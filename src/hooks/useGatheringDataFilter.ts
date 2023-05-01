import {useState, useTransition, useEffect} from 'react';
import type {FilterValue} from '../components/FilterDrawer';

export function useGatheringDataFilter(
  gatheringItems: AppGlobal.GatheringItem[],
  filterValue: FilterValue,
  searchName: string,
): [
  isPending: boolean,
  filteredGatheringItems: AppGlobal.GatheringItem[],
  effectiveFilterAmount: number,
] {
  const [filteredGatheringItems, setFilteredGatheringItems] =
    useState(gatheringItems);
  const [isPending, startTransition] = useTransition();
  let filterAmount = 0;
  for (const filterVal of Object.values(filterValue)) {
    if (filterVal !== null) {
      filterAmount++;
    }
  }
  useEffect(() => {
    startTransition(() => {
      const filterResult = gatheringItems.filter(item => {
        if (searchName !== '') {
          if (!item.name.includes(searchName)) {
            return false;
          }
        }
        if (filterValue.isRare === true) {
          if (!item.isRare) {
            return false;
          }
        }
        if (filterValue.isRare === false) {
          if (item.isRare) {
            return false;
          }
        }
        if (filterValue.classJob !== null) {
          let effectiveFlag = false;
          for (const gatheringPoint of item.gatheringPoints) {
            if (gatheringPoint.classJob === filterValue.classJob) {
              effectiveFlag = true;
            }
          }
          if (!effectiveFlag) {
            return false;
          }
        }
        if (filterValue.specialType !== null) {
          if (filterValue.specialType === 'hidden') {
            if (!item.isHidden) {
              return false;
            }
          }
          if (filterValue.specialType === 'reducible') {
            if (!item.isReducible) {
              return false;
            }
          }
        }
        if (filterValue.exVersion !== null) {
          if (item.exVersion !== filterValue.exVersion) {
            return false;
          }
        }
        if (filterValue.gatheringItemLevel !== null) {
          if (
            item.gatheringItemLevel > filterValue.gatheringItemLevel ||
            item.gatheringItemLevel <= filterValue.gatheringItemLevel - 5
          ) {
            return false;
          }
        }
        if (filterValue.mapId !== null) {
          let effectiveFlag = false;
          for (const gatheringPoint of item.gatheringPoints) {
            if (gatheringPoint.mapId === filterValue.mapId) {
              effectiveFlag = true;
            }
          }
          if (!effectiveFlag) {
            return false;
          }
        }
        return true;
      });
      setFilteredGatheringItems(filterResult);
    });
  }, [filterValue, gatheringItems, searchName]);
  return [isPending, filteredGatheringItems, filterAmount];
}
