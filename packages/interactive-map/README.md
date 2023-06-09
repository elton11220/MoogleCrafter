# @mooglecrafter/interactive-map

基于 `FFCafe` 的 `Interactive Map` 进行二次封装，添加了部分 `TS` 类型声明并使用 `Webpack` 打包。

## 如何使用

你可以选择在 `vercel` 中部署这个仓库，在 `App` 相关 `WebView` 中配置好相关 `URL`，这样做的好处是你可以随时修改地图的一些配置。（如：修改 CDN、调整样式）

你也可以选择将打包后的页面嵌入到应用中，这样可以节省页面加载的时间。

### 安装依赖

仓库使用了 `yarn workspace + lerna` 管理 `monorepo`，建议使用 `lerna` 管理依赖：

1. `npm i -g lerna`
2. 打开项目根目录
3. `lerna bootstrap`

### 运行

- 以 `development` 模式运行：`lerna run dev --scope @mooglecrafter/interactive-map`

- 以 `production` 模式运行：`lerna run build --scope @mooglecrafter/interactive-map`

### 独立运行

如果你只希望使用这个包，可以使用以下命令安装依赖并运行：

1. `yarn install`
2. `yarn dev` / `yarn build`

## Todo

1. 目前需要修改 `App` 相关代码，使页面能够嵌入到应用。
2. 需要调整构建流程，使此仓库执行完 `build` 后自动将打包结果复制到应用内。

## 页面查询参数

| searchParam | 是否必需 | 默认值 | 数据类型 | 描述                |
| :---------: | :------: | :----: | :------: | :------------------ |
|    mapId    |    Y     |        | integer  | Map 表中的地图 ID   |
|      x      |    Y     |        |  float   | 标记点的 x 轴 坐标  |
|      y      |    Y     |        |  float   | 标记点的 y 轴 坐标  |
|    zoom     |    N     |   -2   |  float   | 地图缩放级别 -3 ~ 3 |
|  center_x   |    N     |   x    |  float   | 中心点的 x 轴坐标   |
|  center_y   |    N     |   y    |  float   | 中心点的 y 轴坐标   |
