import {memo, useMemo} from 'react';
import {StyleSheet} from 'react-native';
import type {FC} from 'react';
import MaterialAppHeaderAction from '../MaterialAppHeaderAction';
import type {MaterialAppHeaderBackAction as MaterialAppHeaderBackActionType} from './typings';
import {px2DpX} from '../../utils/dimensionConverter';

const MaterialAppHeaderBackAction: FC<
  MaterialAppHeaderBackActionType.Props
> = props => {
  const {style: restStyle} = props;
  const style = useMemo(
    () =>
      StyleSheet.create({
        container: {
          marginLeft: px2DpX(4),
        },
      }),
    [],
  );
  return (
    <MaterialAppHeaderAction
      {...props}
      style={[style.container, restStyle]}
      icon="arrow-back"
      initAnimation={false}
    />
  );
};

export default memo(MaterialAppHeaderBackAction);
