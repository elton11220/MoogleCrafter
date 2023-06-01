import {Dimensions} from 'react-native';

const uiWidthPx = 390;
const uiHeightPx = 844;
const {width: deviceWidthDp, height: deviceHeightDp} = Dimensions.get('window');

export function px2DpX(elePx: number) {
  return (deviceWidthDp / uiWidthPx) * elePx;
}

export function px2DpY(elePx: number) {
  return (deviceHeightDp / uiHeightPx) * elePx;
}
