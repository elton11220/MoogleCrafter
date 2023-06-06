# @mooglecrafter/app

`App` 的源代码，没什么可以描述的。这是一个使用 `React Native` 开发的 `最终幻想XIV 采集笔记 & 采集时钟 App`。

## 如何使用

### 搭建开发环境

[https://www.reactnative.cn/docs/environment-setup](https://www.reactnative.cn/docs/environment-setup)

开发环境要求：

|          名称           |     版本     |
| :---------------------: | :----------: |
|         Node.js         |      16      |
|           JDK           |      11      |
|          yarn           |    latest    |
|          lerna          |    ^6.6.2    |
|       Android SDK       |      33      |
| Android SDK Build-Tools |    33.0.0    |
|           NDK           | 23.1.7779620 |
|          CMake          |    3.18.1    |

> 你可能需要将你的 `gradle` 源设置为国内镜像，因为下载很慢。

### 安装依赖

仓库使用了 `yarn workspace + lerna` 管理 `monorepo`，建议使用 `lerna` 管理依赖：

1. `npm i -g lerna`
2. 打开项目根目录
3. `lerna bootstrap`

### 运行

|     script      |       description        |
| :-------------: | :----------------------: |
|    `android`    |      以开发模式运行      |
| `android:build` | 以生产模式运行，打包 Apk |
|     `start`     |   开启 `metro` 服务器    |

## 构建流程

应用需要格式化的游戏数据才能正常运行，所以在运行或打包前会执行一些操作用于生成游戏数据、生成部分应用功能。

执行以下命令前，会执行 `@mooglecrafter/data-extraction -> build` 操作：

- `lerna run start`
- `lerna run android`
- `lerna run android:build`

## 输出说明

运行 `lerna run android:build` 后，会输出以下文件（介绍部分）：

| 文件                                                                 |        描述        |
| :------------------------------------------------------------------- | :----------------: |
| `/android/app/build/outputs/apk/release/app-arm64-v8a-release.apk`   |  arm64-v8a 安装包  |
| `/android/app/build/outputs/apk/release/app-armeabi-v7a-release.apk` | armeabi-v7a 安装包 |
| `/android/app/build/outputs/apk/release/app-universal-release.apk`   |   通用架构安装包   |
| `/android/app/build/outputs/apk/release/app-x86_64-release.apk`      |   x86_64 安装包    |
| `/android/app/build/outputs/apk/release/app-x86-release.apk`         |     x86 安装包     |
| `/android/app/build/outputs/mapping/release/mapping.txt`             | Proguard 混淆信息  |

## License

[GPL-3.0](https://opensource.org/license/gpl-3-0/)

Copyright (c) 2023-present, [elton11220](https://github.com/elton11220)
