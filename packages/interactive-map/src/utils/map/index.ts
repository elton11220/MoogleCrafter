export async function createMapInstance<T extends HTMLElement>(
  element: T
): Promise<MapUtils.EorzeaMapInstance> {
  return await window.YZWF.eorzeaMap.create(element);
}
