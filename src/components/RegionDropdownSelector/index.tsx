import {View} from 'react-native';
import {FC, useCallback, useEffect, useState} from 'react';
import {regionItemsSelector, useStore} from '../../store';
import RegionDropdownMenuSection from '../RegionDropdownMenuSection';

const RegionDropdownSelector: FC<RegionDropdownSelector.Props> = props => {
  const {value, onChange, collapsedSectionId, onCollapseSection} = props;
  const regions = useStore(regionItemsSelector);
  const [activatedSectionId, setActivatedSectionId] =
    useState(collapsedSectionId);
  useEffect(() => {
    setActivatedSectionId(collapsedSectionId);
  }, [collapsedSectionId]);
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
        <RegionDropdownMenuSection
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

export default RegionDropdownSelector;
