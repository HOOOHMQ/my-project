# 智能体旅行助手 - API 配置指南

## 概述

本应用集成了 **GLM-4.7 AI 模型** 和 **高德地图** 服务，提供智能的旅行规划功能。

## 环境变量配置

在项目根目录下创建 `.env` 文件，并配置以下 API Key：

```env
# GLM-4.7 API 配置
VITE_GLM_API_KEY=your_glm_api_key_here
VITE_GLM_API_URL=https://open.bigmodel.cn/api/paas/v4/chat/completions

# 高德地图 API 配置
VITE_AMAP_API_KEY=your_amap_api_key_here
VITE_AMAP_SECURITY_JS_CODE=your_amap_security_code_here
```

## 获取 GLM-4.7 API Key

### 1. 注册账号

访问 [智谱AI开放平台](https://open.bigmodel.cn/)，注册账号并完成实名认证。

### 2. 创建 API Key

1. 登录后进入控制台
2. 点击左侧菜单的"API Key"
3. 点击"创建新的 API Key"
4. 复制生成的 API Key 到 `.env` 文件的 `VITE_GLM_API_KEY` 中

### 3. API 费用说明

- GLM-4-Flash: 免费（有调用频率限制）
- GLM-4: 按量计费（请参考官方定价）

## 获取高德地图 API Key

### 1. 注册开发者账号

访问 [高德开放平台](https://lbs.amap.com/)，注册成为开发者。

### 2. 创建应用和 Key

1. 登录后进入"应用管理"
2. 点击"创建新应用"
3. 添加 Key，选择 "Web端(JS API)"
4. 复制生成的 Key 和安全密钥到 `.env` 文件中：
   - `VITE_AMAP_API_KEY`: API Key
   - `VITE_AMAP_SECURITY_JS_CODE`: 安全密钥（可选）

### 3. 配置域名白名单（可选）

如果需要在生产环境使用，需要在高德控制台配置域名白名单。

## 配置完成后的测试

### 1. 重启开发服务器

修改 `.env` 文件后，需要重启开发服务器：

```bash
npm run dev
```

### 2. 测试 AI 行程生成

1. 打开应用，进入"行程规划"页面
2. 填写目的地、日期等信息
3. 点击"生成行程计划"
4. 如果配置正确，将由 GLM-4.7 生成智能行程

### 3. 测试地图功能

1. 生成行程后，进入"地图可视化"页面
2. 查看景点标记和路线
3. 如果配置正确，将显示高德地图

## 不配置 API Key 也能使用

应用设计了降级方案：

- **未配置 GLM API Key**: 使用内置的模拟数据生成行程，但功能有限
- **未配置高德地图 API Key**: 地图页面显示配置提示，无法显示地图

## 常见问题

### 1. API 调用失败

**问题**: 提示"请先配置 GLM API Key"

**解决方案**:
- 检查 `.env` 文件是否正确配置
- 确认 API Key 是否有效
- 重启开发服务器

### 2. 地图无法加载

**问题**: 地图页面显示"请配置高德地图 API Key"

**解决方案**:
- 检查高德 API Key 是否正确
- 确认 Key 类型为 "Web端(JS API)"
- 检查浏览器控制台是否有错误信息

### 3. 跨域问题

如果遇到跨域问题，需要配置代理。在 `vite.config.js` 中添加：

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://open.bigmodel.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

## 安全建议

1. **不要提交 API Key 到 Git**: `.env` 文件已在 `.gitignore` 中
2. **生产环境配置**: 使用环境变量或配置中心管理 API Key
3. **定期更换 Key**: 定期更新 API Key 以提高安全性

## 更多资源

- [智谱AI 官方文档](https://open.bigmodel.cn/dev/api)
- [高德地图 JS API 文档](https://lbs.amap.com/api/javascript-api/summary)
- [高德地图 Key 使用说明](https://lbs.amap.com/api/javascript-api/guide/abc/load)

## 技术支持

如遇到问题，请：
1. 查看浏览器控制台错误信息
2. 检查 `.env` 文件配置
3. 查看 API 官方文档
4. 提交 Issue 到项目仓库
