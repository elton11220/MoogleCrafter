import { createMapInstance } from "./utils/map";
import { getSearchParams } from "./utils/url";
import "./index.css";

console.log(`莫古锤子应用内交互地图 V1.1.0
By 绿胡子大叔
===============================
interactive-map
Powered by FFCafe
https://www.ffcafe.cn/
===============================
Last modified: 2023/5/31`);

const searchParams = getSearchParams<{
  x: number;
  y: number;
  mapId: number;
  center_x?: number;
  center_y?: number;
  zoom?: number;
}>();
const { x, y, mapId, center_x, center_y, zoom } = searchParams;

(async () => {
  const el = document.querySelector("#eorzea-map") as HTMLElement;
  const mapInstance = await createMapInstance(el);
  await mapInstance.loadMapKey(mapId);

  // 右下角显示坐标
  const posEle = $(".upper-pos-container")[0];
  const posXEle = document.createElement("span");
  posXEle.innerText = `X: ${x.toFixed(1)}`;
  const posYEle = document.createElement("span");
  posYEle.innerText = `Y: ${y.toFixed(1)}`;
  posEle.append(posXEle, " ", posYEle);

  // 添加旗子图标
  const iconUrl = window.YZWF.eorzeaMap.loader.getIconUrl(
    "ui/icon/060000/060561.tex"
  );
  const marker = window.YZWF.eorzeaMap.simpleMarker(
    x,
    y,
    iconUrl,
    mapInstance.mapInfo
  );
  mapInstance.addMarker(marker);

  // 设置位置
  setTimeout(() => {
    mapInstance.setView(
      mapInstance.mapToLatLng2D(
        center_x ? center_x : x,
        center_y ? center_y : y
      ),
      zoom ? zoom : -2
    );
  }, 300);
})();
