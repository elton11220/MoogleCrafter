/**
 * 如果一个 csv 的 key 为 float 类型，那么可以将记录按 key 的整数部分分类
 * @param flatArray {any[]} 由 parseCsv 函数得到的数组
 * @param keyName {string} 键的属性名（键应该被解析为 string 类型）
 * @returns {{data: Record<number, any[]>, size: number}}
 */
function parseArray(flatArray, keyName) {
  const map = new Map();
  flatArray.forEach((item, idx) => {
    const isComplexKey = /^\d+\.\d+$/.test(item[keyName]);
    const splittedKey = isComplexKey ? item[keyName].split(".") : null;
    const majorKey = isComplexKey
      ? Number.parseInt(splittedKey[0])
      : Number.parseInt(item[keyName]);
    const subKey = isComplexKey ? Number.parseInt(splittedKey[1]) : 0;
    const value = {
      key: { majorKey, subKey, originKey: item[keyName] },
      data: item,
    };
    if (map.has(majorKey)) {
      map.get(majorKey).push(value);
    } else {
      map.set(majorKey, [value]);
    }
  });
  const pureMap = new Map([...map.entries()]);
  for (const [key, value] of pureMap.entries()) {
    pureMap.set(
      key,
      value
        .sort((a, b) => a.key.subKey - b.key.subKey)
        .map((_item) => ({ ..._item.data, [keyName]: _item.key.subKey }))
    );
  }
  return {
    pureObj: [...pureMap.entries()].reduce(
      (obj, [key, value]) => ((obj[key] = value), obj),
      {}
    ),
    map: map,
    pureMap: pureMap,
    size: map.size,
  };
}

module.exports = {
  parseArray,
};
