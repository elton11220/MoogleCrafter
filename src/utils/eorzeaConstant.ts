enum ExVersion {
  REALM_REBORN,
  HEAVEN_SWARD,
  STORM_BLOOD,
  SHADOW_BRINGERS,
  END_WALKER,
}

const ExVersionNames = [
  '重生之境',
  '苍穹之禁城',
  '红莲之狂潮',
  '暗影之逆焰',
  '晓月之终途',
];

const GatheringTypes = ['采掘', '碎石', '采伐', '割草', '', ''];

Object.freeze(ExVersionNames);
Object.freeze(GatheringTypes);

export {ExVersionNames, ExVersion, GatheringTypes};
