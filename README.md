# 忘不了 (Never Forget)

[English](./README_EN.md) | 简体中文

一个基于 Vue 3 的笔记和提醒应用，帮助你记录想法并设置多种类型的提醒。

## 功能特点

### 核心功能

- **快速笔记**：轻松记录文字内容和图片
- **分类管理**：创建自定义分类并为笔记分配不同颜色的标签
- **多维度提醒**：支持同时设置基于时间、地点和联系人的提醒
- **本地存储**：所有数据保存在浏览器的 localStorage 中，刷新页面不会丢失

### 笔记功能

- 支持文本和图片混合内容
- 自定义分类和颜色标签
- 笔记列表和详情视图

### 提醒系统

- 时间提醒：设置特定的日期和时间
- 地点提醒：关联特定位置
- 联系人提醒：关联特定联系人
- 支持同时设置多种提醒类型

## 技术实现

- **前端框架**：Vue 3 + TypeScript
- **构建工具**：Vite
- **UI 组件库**：Element Plus
- **状态管理**：Pinia
- **路由管理**：Vue Router
- **数据持久化**：localStorage

## 开始使用

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

## 项目结构

- `src/components`：可复用组件
- `src/views`：页面视图
- `src/stores`：Pinia 状态管理
- `src/router`：Vue Router 路由配置
