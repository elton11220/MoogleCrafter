# 肥肥咖啡交互地图

本仓库的内容是一个使用由 `FFCafe` 开发的 `Interactive Map` 的地图页面，目的是为了更方便地控制地图实例的参数。

# 查询参数

| searchParam | 是否必需 | 默认值 | 数据类型 | 描述                |
| :---------: | :------: | :----: | :------: | :------------------ |
|    mapId    |    Y     |        | integer  | Map 表中的地图 ID   |
|      x      |    Y     |        |  float   | 标记点的 x 轴 坐标  |
|      y      |    Y     |        |  float   | 标记点的 y 轴 坐标  |
|    zoom     |    N     |   -2   |  float   | 地图缩放级别 -3 ~ 3 |
|  center_x   |    N     |   x    |  float   | 中心点的 x 轴坐标   |
|  center_y   |    N     |   y    |  float   | 中心点的 y 轴坐标   |
