# @mooglecrafter/data-extraction

这个包用于从 `ffxiv-datamining-cn` 仓库的 `csv` 文件中提取出应用需要的采集数据并将其转换为 `SQLite` 和 `JSON`。同时，从 `SaintConiach` 中提取的图标集合中获取需要的素材的图标

## 仓库结构

| 目录               |      描述      |
| :----------------- | :------------: |
| /dist              |  资源输出目录  |
| /src/config        |    配置文件    |
| /src/data          |  原始资源目录  |
| /src/data/csv      |  csv 数据目录  |
| /src/data/json     | json 数据目录  |
| /src/data/icon     |  素材图标目录  |
| /src/data-exporter | 游戏数据提取器 |
| /src/icon-exporter | 图标资源提取器 |
| /src/utils         |      工具      |
| /index.js          |      入口      |

## 如何使用

本仓库为 `@mooglecrafter/main` 的子仓库，在主仓库 `prebuild` 阶段自动执行相关流程

### 在运行前你需要准备什么

- 首先，你需要提取游戏图标资源

  1. 下载 `SaintCoinach`：
     [https://github.com/xivapi/SaintCoinach/releases](https://github.com/xivapi/SaintCoinach/releases)

  2. 使用终端打开解压后目录，运行 `.\SaintCoinach.Cmd.exe D:\最终幻想 XIV`（改成你的游戏安装目录）

  3. 输入 `ui`，按回车。同时打开 `SaintCoinach` 根目录生成的游戏版本号目录，打开 `/ui/icon` 目录。当 `000000` - `060000` 目录提取完毕时可按下 `Ctrl + C` 结束提取操作。

  4. 将所有数字目录复制到 `/packages/data-extraction/src/data/icon`

- 然后，下载 `ffxiv-datamining-cn`

  1. [https://github.com/thewakingsands/ffxiv-datamining-cn](https://github.com/thewakingsands/ffxiv-datamining-cn)

  2. 将解压后将根目录中所有的 csv 文件放入 `/packages/data-extraction/src/data/csv`

- 下载 `reduction.json`

  1. [https://github.com/ffxiv-teamcraft/ffxiv-teamcraft/blob/staging/libs/data/src/lib/json/reduction.json](https://github.com/ffxiv-teamcraft/ffxiv-teamcraft/blob/staging/libs/data/src/lib/json/reduction.json)

  2. 复制到 `/packages/data-extraction/src/data/json`

- 下载 `aetherytes.json`

  1. [https://github.com/ffxiv-teamcraft/ffxiv-teamcraft/blob/staging/libs/data/src/lib/json/aetherytes.json](https://github.com/ffxiv-teamcraft/ffxiv-teamcraft/blob/staging/libs/data/src/lib/json/aetherytes.json)

  2. 复制到 `/packages/data-extraction/src/data/json`

### 安装依赖

仓库使用了 `yarn workspace + lerna` 管理 `monorepo`，有以下几种安装依赖的方法：

- `yarn install`
- `lerna bootstrap`

### 运行

列出几种独立运行此包的方法：

- `cd /packages/data-extraction && yarn build`
- `lerna run build --scope @mooglecrafter/data-extraction`

### 独立运行

如果你只希望使用这个包，可以使用以下命令安装依赖并运行：

1. `yarn install`
2. `yarn build`

## 输出说明

此工具会在 `/dist` 目录中输出处理后的采集数据及相关资源

| 文件或目录                    |          描述          |
| :---------------------------- | :--------------------: |
| /dist/database.db             | 采集数据（仅用作中转） |
| /dist/gatheringData.json      |        采集数据        |
| /dist/gatheringPointBase.json |       采集点数据       |
| /dist/reductionData.json      |      精选素材数据      |
| /dist/itemIcons               |        素材图标        |

## License

[GPL-3.0](https://opensource.org/license/gpl-3-0/)

Copyright (c) 2023-present, [elton11220](https://github.com/elton11220)
