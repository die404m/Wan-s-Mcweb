# Minecraft 服务器网站

基于 Astro 框架构建的 Minecraft 服务器官方网站，具有奶油白风格、毛玻璃效果和完整的响应式设计。

## ✨ 特性

- 🎨 **奶油白风格设计** - 柔和的色彩搭配和圆滑的界面设计
- 🪟 **毛玻璃效果** - 现代化的玻璃质感界面元素
- 🌙 **日夜模式切换** - 支持日间和夜间主题切换
- 🎵 **音乐播放器** - 集成 Meting API 的音乐播放功能
- 🖼️ **动态背景** - 自动切换的背景图片系统
- 📱 **响应式设计** - 完美适配桌面和移动设备
- ⚡ **高性能** - 基于 Astro 的静态站点生成
- 📊 **本地数据获取** - 支持历程、相册、排行榜、成员列表的本地文件数据获取
- 🔄 **自动扫描** - 自动扫描文件夹中的图片文件，无需手动配置
- 🛡️ **生产环境兼容** - 在开发和生产环境中都能正常工作

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
src/
├── components/          # 可复用组件
│   ├── Navigation.astro # 导航栏组件
│   ├── MusicPlayer.astro # 音乐播放器
│   └── Footer.astro     # 页脚组件
├── config/             # 配置文件
│   └── website.config.js # 网站配置
├── layouts/            # 布局文件
│   └── Layout.astro    # 主布局
└── pages/              # 页面文件
    ├── index.astro     # 主页
    ├── history.astro   # 历程页面
    ├── leaderboard.astro # 排行榜页面
    └── about.astro     # 关于页面

public/
├── backgrounds/        # 背景图片
├── scripts/            # JavaScript 文件
└── styles/             # 样式文件
```

## ⚙️ 配置说明

### 网站基本信息配置

编辑 `src/config/website.config.js` 文件：

```javascript
site: {
    title: "Minecraft服务器 - 方块世界",
    description: "欢迎来到我们的Minecraft服务器，探索无限可能的方块世界！",
    keywords: "Minecraft,服务器,我的世界,Java版,生存,创造",
    author: "Minecraft Server Team",
    language: "zh-CN"
}
```

### 导航栏配置

```javascript
navigation: {
    items: [
        {
            name: "主页",
            path: "/",
            icon: "mdi:home",
            enabled: true
        },
        // 添加更多页面...
    ]
}
```

### 背景图片配置

```javascript
background: {
    images: [
        "/backgrounds/bg1.jpg",
        "/backgrounds/bg2.jpg",
        "/backgrounds/bg3.jpg"
    ],
    transitionInterval: 8000, // 切换间隔时间（毫秒）
    transitionDuration: 2000  // 切换动画持续时间
}
```

### 音乐播放器配置

```javascript
musicPlayer: {
    enabled: true,
    metingApi: "https://api.i-meto.com/meting/api",
    server: "netease", // netease, kugou, kuwo, qq, xiami
    type: "playlist",   // playlist, song, album, search
    id: "3778678"       // 歌单ID
}
```

### 主题颜色配置

```javascript
theme: {
    light: {
        // 日间模式颜色
    },
    dark: {
        // 夜间模式颜色
    }
}
```

## 📄 添加新页面

### 方法一：通过配置文件添加

1. 在 `src/config/website.config.js` 中的 `navigation.items` 添加新项：

```javascript
{
    name: "新页面",
    path: "/new-page",
    icon: "mdi:star",
    enabled: true
}
```

2. 创建对应的页面文件 `src/pages/new-page.astro`

### 方法二：使用内置函数

```javascript
import { addNewPage } from '../config/website.config.js';

addNewPage({
    key: "newPage",
    name: "新页面",
    path: "/new-page",
    icon: "mdi:star",
    title: "新页面标题",
    description: "页面描述"
});
```

## 🎨 自定义样式

### 修改主题颜色

编辑 `public/styles/global.css` 中的 CSS 变量：

```css
:root {
    --color-primary: #ff8eb7;     /* 主色调 */
    --color-secondary: #a6e3e9;   /* 辅助色 */
    --color-accent: #ffd166;      /* 强调色 */
    --color-bg: #fef7f0;          /* 背景色 */
    /* 更多颜色变量... */
}
```

### 添加自定义 CSS

在 `public/styles/` 目录下创建新的 CSS 文件，然后在页面中引入。

## 📊 本地数据获取系统

### 概述

系统现在支持从本地文件获取数据，不再依赖外部API，提供更稳定、更快速的数据访问体验。

### 支持的数据类型

- **历程数据** - 从 `public/assets/history-images/` 文件夹自动扫描图片
- **相册数据** - 从 `public/assets/gallery-images/` 文件夹自动扫描图片
- **排行榜数据** - 从 `public/assets/leaderboard/count_export.json` 文件获取
- **成员列表数据** - 从 `public/assets/memberlist/whitelist.json` 文件获取

### 配置说明

#### 历程和相册配置

编辑 `src/config/website.config.js` 文件：

```javascript
// 历程配置
history: {
    // 图片文件夹路径
    imagesFolder: "/assets/history-images"
},

// 相册配置
gallery: {
    // 图片文件夹路径
    imagesFolder: "/assets/gallery-images"
}
```

#### 排行榜配置

```javascript
// 排行榜配置
leaderboard: {
    // 本地JSON文件配置
    localFile: {
        path: "/assets/leaderboard/count_export.json",
        cacheTimeout: 300000 // 5分钟缓存
    }
}
```

#### 成员列表配置

```javascript
// 关于页面配置
about: {
    // 成员列表配置
    members: {
        enabled: true,
        title: "服务器成员",
        description: "我们的服务器大家庭",
        
        // 数据获取方式："manual" 或 "localFile"
        dataSource: "localFile",
        
        // 本地文件配置
        localFile: {
            path: "/assets/memberlist/whitelist.json",
            cacheTimeout: 300000 // 5分钟缓存
        }
    }
}
```

### 文件命名规范

#### 历程和相册图片命名

图片文件名应遵循以下格式：
- `YYYY-MM-DD_标题_作者1,作者2.webp` (历程图片)
- `YYYY-MM-DD_分类_描述.webp` (相册图片)

示例：
- `2025-10-05_潜影贝农场_Bu_XiAo_Le,EpiphanyEX.webp`
- `2025-10-05_红石_潜影贝农场.webp`

#### JSON文件格式

**排行榜数据格式 (`count_export.json`)**：
```json
{
    "export_time": "2026-02-19 23:23:28",
    "objectives": {
        "计分板名称": {
            "player_scores": [
                {"player": "玩家名", "score": 100}
            ]
        }
    }
}
```

**成员列表格式 (`whitelist.json`)**：
```json
[
    {"uuid": "玩家UUID", "name": "玩家名"}
]
```

### 自动扫描功能

系统会自动扫描指定文件夹中的图片文件，无需手动配置文件列表：

1. **自动识别** - 系统会自动检测文件夹中的图片文件
2. **智能过滤** - 只识别支持的图片格式 (.jpg, .jpeg, .png, .webp, .gif)
3. **自动排序** - 按文件名自动排序（通常是按日期排序）
4. **容错机制** - 如果自动扫描失败，会回退到手动列表

### 更新数据

1. **添加新图片** - 直接将图片放入对应的文件夹即可
2. **修改文件名** - 系统会自动识别新的文件名
3. **删除图片** - 系统会自动排除已删除的图片
4. **更新JSON文件** - 替换对应的JSON文件
5. **重新构建** - 运行 `npm run build` 即可生效

### 优势

- ✅ **更稳定** - 不依赖外部API，避免网络问题
- ✅ **更快速** - 本地文件加载比API请求更快
- ✅ **更安全** - 没有外部API依赖，减少安全风险
- ✅ **更可控** - 完全控制数据源，便于维护
- ✅ **自动更新** - 无需手动修改代码，系统自动识别文件变化

## 🎵 音乐播放器使用

### 支持的平台

- Netease (网易云音乐)
- Kugou (酷狗音乐)
- Kuwo (酷我音乐)
- QQ音乐
- Xiami (虾米音乐)

### 配置示例

```javascript
musicPlayer: {
    server: "netease",     // 平台
    type: "playlist",      // 类型: playlist, song, album, search
    id: "3778678",         // 歌单/歌曲/专辑 ID
    autoPlay: false,       // 自动播放
    volume: 0.8            // 音量
}
```

## 📱 响应式设计

网站已针对以下设备进行优化：

- 桌面电脑 (1200px+)
- 平板电脑 (768px - 1199px)
- 手机设备 (小于 768px)

## 🔧 开发指南

### 组件开发

所有组件使用 Astro 语法，支持：
- 前端框架组件 (React, Vue, Svelte)
- Markdown 内容
- 静态资源优化

### 样式规范

- 使用 CSS 变量进行主题管理
- 采用 BEM 命名规范
- 支持 CSS Modules
- 响应式设计优先

### 性能优化

- 静态资源预加载
- 图片懒加载
- CSS/JS 压缩
- 代码分割

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如有问题，请通过以下方式联系：
- 创建 GitHub Issue
- 发送邮件至 me@wanfory.top
