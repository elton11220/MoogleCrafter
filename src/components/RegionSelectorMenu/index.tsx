import {View} from 'react-native';
import {useCallback, useEffect} from 'react';
import type {FC} from 'react';
import {regionItemsSelector, useStore} from '../../store';
import RegionSelectorMenuGroup from '../RegionSelectorMenuGroup';

const RegionSelectorMenu: FC<RegionSelectorMenu.Props> = props => {
  const {
    value,
    onChange,
    collapsedGroupId,
    onCollapseGroup,
    activatedGroupId,
    onActivateGroup,
  } = props;
  const regions = useStore(regionItemsSelector);
  useEffect(() => {
    if (value === null) {
      onActivateGroup(0);
    }
  }, [onActivateGroup, value]);
  const onItemSelected = useCallback(
    (groupId: number, itemId: number) => {
      onActivateGroup(groupId);
      onChange(itemId);
    },
    [onActivateGroup, onChange],
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
          activated={index === activatedGroupId}
          collapsed={collapsedGroupId === index}
          onCollapse={onCollapseGroup}
          onSelected={onItemSelected}
        />
      ))}
    </View>
  );
};

export default RegionSelectorMenu;
