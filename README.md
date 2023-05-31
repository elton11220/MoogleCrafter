# 莫古锤子应用内交互地图

基于 `FFCafe` 的 `Interactive Map` 进行二次封装，添加了部分 `TS` 类型声明并使用 `Webpack` 打包

## 如何使用

- 安装依赖：`yarn`
- 调试：`yarn dev`
- 打包：`yarn build`

## 查询参数

| searchParam | 是否必需 | 默认值 | 数据类型 | 描述                |
| :---------: | :------: | :----: | :------: | :------------------ |
|    mapId    |    Y     |        | integer  | Map 表中的地图 ID   |
|      x      |    Y     |        |  float   | 标记点的 x 轴 坐标  |
|      y      |    Y     |        |  float   | 标记点的 y 轴 坐标  |
|    zoom     |    N     |   -2   |  float   | 地图缩放级别 -3 ~ 3 |
|  center_x   |    N     |   x    |  float   | 中心点的 x 轴坐标   |
|  center_y   |    N     |   y    |  float   | 中心点的 y 轴坐标   |
