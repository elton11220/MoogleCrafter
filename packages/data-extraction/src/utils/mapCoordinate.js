/**
 *
 * @param coords {{ x: number, y: number, z: number }}
 * @param mapData {{ size_factor: number, offset_y: number, offset_x: number, offset_z: number }}
 * @returns {{ x: number, y: number, z: number }}
 */

function getCoords(coords, mapData) {
  const c = mapData.size_factor / 100;
  const x = (+coords.x + mapData.offset_x) * c;
  const y = (+coords.y + mapData.offset_y) * c;
  return {
    x: Math.floor(((41.0 / c) * ((+x + 1024.0) / 2048.0) + 1) * 100) / 100,
    y: Math.floor(((41.0 / c) * ((+y + 1024.0) / 2048.0) + 1) * 100) / 100,
    z: Math.floor(coords.z - mapData.offset_z) / 100,
  };
}

/**
 *
 * @param start {{x: number, y: number}}
 * @param target {{x: number, y: number}}
 * @returns number
 */
function getDistance(start, target) {
  return Math.sqrt(
    Math.pow(target.x - start.x, 2) + Math.pow(target.y - start.y, 2)
  );
}

/**
 * @param aetheryte {{id: number, placeName: string, mapId: number, x: number, y: number, z: number, type: number}}
 * @param target {{x: number, y: number}}
 * @returns number
 */
function getDistanceFromAetheryte(aetheryte, target) {
  let distance = getDistance(aetheryte, target);
  if (aetheryte.id === 173 && target.y > 15) {
    distance *= 2;
  }
  if (aetheryte.id === 147 && target.y > 24) {
    distance *= 2;
  }
  if (aetheryte.id === 148 && target.y <= 24) {
    distance *= 2;
  }
  return distance;
}

/**
 * @param aetherytes {Map<number, {id: number, placeName: string, mapId: number, x: number, y: number, z: number, type: number}>}
 * @param coords {{x: number, y: number}}
 * @returns {{id: number, placeName: string, mapId: number, x: number, y: number, z: number, type: number} | null}
 */
function getNearestAetheryte(aetherytes, coords) {
  let nearest = aetherytes[0];
  for (const aetheryte of aetherytes) {
    if (
      getDistanceFromAetheryte(aetheryte, coords) <
      getDistanceFromAetheryte(nearest, coords)
    ) {
      nearest = aetheryte;
    }
  }
  return nearest;
}

module.exports = {
  getCoords,
  getDistance,
  getDistanceFromAetheryte,
  getNearestAetheryte,
};
