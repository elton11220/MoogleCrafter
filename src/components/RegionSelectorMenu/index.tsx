import {View} from 'react-native';
import {useCallback, useEffect, useState} from 'react';
import type {FC} from 'react';
import {regionItemsSelector, useStore} from '../../store';
import RegionSelectorMenuGroup from '../RegionSelectorMenuGroup';

const RegionSelectorMenu: FC<RegionSelectorMenu.Props> = props => {
  const {value, onChange, collapsedSectionId, onCollapseSection} = props;
  const regions = useStore(regionItemsSelector);
  const [activatedSectionId, setActivatedSectionId] =
    useState(collapsedSectionId);
  useEffect(() => {
    if (value === null) {
      setActivatedSectionId(0);
    }
  }, [value]);
  const onItemSelected = useCallback(
    (sectionId: number, itemId: number) => {
      setActivatedSectionId(sectionId);
      onChange(itemId);
    },
    [onChange],
  );
  return (
    <View>
      {regions.map((region, index) => (
        <RegionSelectorMenuGroup
          key={index}
          id={index}
          label={region.regionName}
          items={region.maps}
          activatedItemId={value || 92}
          activated={index === activatedSectionId}
          collapsed={collapsedSectionId === index}
          onCollapse={onCollapseSection}
          onSelected={onItemSelected}
        />
      ))}
    </View>
  );
};

export default RegionSelectorMenu;
