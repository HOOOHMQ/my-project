# 智能体旅行助手

一个基于 React 的智能旅行规划助手应用，集成 **GLM-4.7 AI 模型** 和 **高德地图**，帮助用户轻松规划和优化旅行行程。

## ✨ 核心功能

### 1. 智能行程规划
- 输入目的地、日期、偏好等信息
- **GLM-4.7 AI 模型**自动生成包含景点、餐饮、酒店的完整行程计划
- 支持多种个性化偏好设置（预算范围、兴趣爱好、住宿类型、交通方式）

### 2. 地图可视化
- 在**高德地图**上直观标注景点位置
- 绘制游览路线，让行程一目了然
- 支持查看每个景点的详细信息

### 3. 预算计算
- 自动计算门票、酒店、餐饮、交通费用
- 显示详细的预算明细和分类统计
- 提供消费分析和费用分布图表

### 4. 行程编辑
- 支持添加、删除、调整景点
- 实时更新地图和预算
- 编辑模式和预览模式切换

### 5. 导出功能
- 导出为 PDF 格式，方便保存和打印
- 导出为图片格式，便于分享到社交媒体
- 单独导出预算明细表格

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 API Key

在项目根目录下创建 `.env` 文件，配置 API Key：

```env
# GLM-4.7 API 配置
VITE_GLM_API_KEY=your_glm_api_key_here
VITE_GLM_API_URL=https://open.bigmodel.cn/api/paas/v4/chat/completions

# 高德地图 API 配置
VITE_AMAP_API_KEY=your_amap_api_key_here
VITE_AMAP_SECURITY_JS_CODE=your_amap_security_code_here
```

详细配置说明请查看 [API_CONFIG.md](./API_CONFIG.md)

### 3. 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:5173 启动。

### 4. 构建生产版本

```bash
npm run build
```

构建产物将在 `dist` 目录中。

### 5. 预览生产构建

```bash
npm run preview
```

## 📦 技术栈

### 前端框架
- **React 19** - 用户界面库
- **Vite** - 构建工具

### UI 组件
- **Ant Design** - 企业级 UI 设计语言和组件库
- **Lucide React** - 现代化图标库

### AI 服务
- **GLM-4.7** - 智谱AI大语言模型（用于智能行程生成）

### 地图集成
- **高德地图 JS API** - 专业地图服务

### 状态管理
- **Zustand** - 轻量级状态管理库

### 工具库
- **Day.js** - 轻量级日期处理库
- **Axios** - HTTP 客户端
- **jsPDF** - 生成 PDF 文档
- **jsPDF AutoTable** - 在 PDF 中生成表格
- **html2canvas** - 将 DOM 元素转换为 canvas

## 📁 项目结构

```
src/
├── components/          # React 组件
│   ├── Planner/        # 行程规划组件
│   ├── Map/            # 地图可视化组件
│   │   └── AMapVisualization.tsx  # 高德地图组件
│   ├── Budget/         # 预算计算组件
│   ├── Editor/         # 行程编辑组件
│   └── Export/         # 导出功能组件
├── store/              # 状态管理
│   └── tripStore.ts    # 旅行计划状态
├── utils/              # 工具函数
│   ├── export.ts       # 导出工具
│   └── glmService.ts   # GLM-4.7 API 服务
├── types/              # TypeScript 类型定义
│   └── index.ts        # 类型定义
├── data/               # 示例数据
│   └── mockData.ts     # 模拟数据
├── App.jsx             # 主应用组件
├── App.css             # 应用样式
├── main.jsx            # 应用入口
└── index.css           # 全局样式
```

## 🎯 使用指南

### 1. 规划行程
1. 访问"行程规划"标签页
2. 填写目的地、出行日期、人数等基本信息
3. 选择预算范围、兴趣爱好、住宿类型和交通方式
4. 点击"生成行程计划"按钮
5. **GLM-4.7 AI**将根据您的偏好生成智能行程

### 2. 查看地图
- 切换到"地图可视化"标签页
- 查看每日行程的景点位置和游览路线
- 点击标记查看景点详细信息
- 使用**高德地图**提供精准的地理位置服务

### 3. 查看预算
- 切换到"预算明细"标签页
- 查看总预算和分类统计
- 了解各项费用的详细分布

### 4. 编辑行程
- 切换到"行程详情"标签页
- 点击右上角"编辑模式"按钮
- 添加、修改或删除景点
- 实时更新地图和预算

### 5. 导出行程
- 在页面右上角选择导出方式
- 导出为 PDF、图片或预算明细

## 🔧 配置说明

### GLM-4.7 API 集成

应用已集成 GLM-4.7 API 服务，配置位置：
- **环境变量**: `.env` 文件
- **API 服务**: `src/utils/glmService.ts`
- **状态管理**: `src/store/tripStore.ts`

如果不配置 API Key，应用将使用模拟数据作为降级方案。

### 高德地图集成

应用使用高德地图 JS API，配置位置：
- **环境变量**: `.env` 文件
- **地图组件**: `src/components/Map/AMapVisualization.tsx`

## 🔑 获取 API Key

### GLM-4.7 API Key

1. 访问 [智谱AI开放平台](https://open.bigmodel.cn/)
2. 注册并完成实名认证
3. 创建 API Key
4. 复制到 `.env` 文件

### 高德地图 API Key

1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 注册成为开发者
3. 创建应用和 Key
4. 选择 "Web端(JS API)" 类型
5. 复制 Key 到 `.env` 文件

详细配置指南请查看 [API_CONFIG.md](./API_CONFIG.md)

## 📝 注意事项

1. **API Key 安全**: 不要将 API Key 提交到 Git
2. **地图加载**: 地图功能需要网络连接
3. **导出限制**: 导出 PDF/图片 功能在某些浏览器可能受限
4. **降级方案**: 未配置 API Key 时使用模拟数据

## 🎨 自定义样式

所有样式文件位于 `src/` 目录：
- `App.css` - 应用特定样式
- `index.css` - 全局基础样式

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👨‍💻 开发者

智能体旅行助手 - 让旅行规划更简单！

## 🔗 相关链接

- [智谱AI 官方文档](https://open.bigmodel.cn/dev/api)
- [高德地图 JS API 文档](https://lbs.amap.com/api/javascript-api/summary)
- [React 官方文档](https://react.dev/)
- [Ant Design 文档](https://ant.design/)
