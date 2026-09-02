<div align="center">
  <img src="./public/achuan-ai-logo.png" alt="阿川 AI Logo" width="180" />

# 阿川 AI

你的专属 AI 助手 · Your Personal AI Assistant

</div>

## 中文

### 项目介绍

阿川 AI 是基于开源项目 [LobeHub](https://github.com/lobehub/lobehub) 定制的 AI 助手与智能体工作平台。项目提供统一的多模型聊天入口，并整合智能体、任务、知识资源、记忆和工具能力，让用户可以在一个界面中完成提问、内容创作和复杂任务处理。

本版本加入了阿川 AI 品牌 Logo、深紫色界面主题、“你的专属 AI 助手”首页标语，以及位于聊天区上方的快速开始引导卡片。

### 功能列表

- **多模型 AI 对话**：在统一界面中选择和使用不同的 AI 模型。
- **快速开始引导**：按照“选择 AI 模型、输入问题、获取回答”三个步骤快速上手。
- **智能体管理**：创建并配置具备不同角色、模型和能力的专属智能体。
- **任务工作流**：创建、跟踪和管理由智能体执行的任务。
- **资源与知识库**：管理文件、知识库和其他可供智能体使用的上下文资源。
- **工具与插件**：通过工具调用和插件扩展搜索、内容处理等能力。
- **个性化记忆**：保存可管理的上下文与偏好，提供更连贯的交互体验。
- **定制品牌界面**：使用阿川 AI 名称、Logo、深紫主题和中文首页标语。

### 安装步骤

#### 1. 环境要求

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/)：使用 `.nvmrc` 指定的 `lts/krypton`
- [pnpm](https://pnpm.io/)：项目锁定版本为 `10.33.0`
- [Bun](https://bun.sh/)：完整开发服务需要
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)：仅完整后端、数据库和存储环境需要

#### 2. 克隆项目

```bash
git clone https://github.com/Achuan-1/lobehub.git
cd lobehub
git switch canary
```

#### 3. 安装依赖

```bash
corepack enable
corepack prepare pnpm@10.33.0 --activate
pnpm install
```

#### 4. 配置开发环境

macOS / Linux：

```bash
cp .env.example.development .env.development.local
```

Windows PowerShell：

```powershell
Copy-Item .env.example.development .env.development.local
```

编辑 `.env.development.local`，将所有 `REPLACE_WITH_*` 占位符替换为独立的强随机值。可以分别使用 `openssl rand -base64 32` 生成 `KEY_VAULTS_SECRET` 和 `AUTH_SECRET`。同时至少配置一个可用的模型服务密钥，例如 `OPENAI_API_KEY`；不要提交生成后的本地环境文件。

#### 5. 启动项目

仅启动前端预览：

```bash
pnpm dev:spa
```

默认访问地址为 `http://localhost:9876/`。如果端口被占用，请使用终端输出的实际地址。

启动完整开发环境：

```bash
pnpm dev:docker
pnpm db:migrate
pnpm dev
```

完整模式通常会启动 Next.js 服务和 Vite 前端，具体端口以终端输出为准。

### 使用说明

1. 在浏览器中打开终端显示的本地网址。
2. 在聊天区选择需要使用的 AI 模型。
3. 输入问题或任务要求，然后发送消息。
4. 等待模型生成回答，并根据需要继续追问。
5. 使用侧栏进入“任务”“资源”“生成”“文稿”或“记忆”等功能。
6. 如需使用其他模型，请在设置中添加对应服务商的 API Key，或在环境变量中配置密钥。

停止开发服务时，在运行服务的终端中按 `Ctrl+C`。

---

## English

### Project Overview

Achuan AI is a customized AI assistant and agent workspace built on the open-source [LobeHub](https://github.com/lobehub/lobehub) project. It provides a unified multi-model chat experience together with agents, tasks, knowledge resources, memory, and tools, allowing users to ask questions, create content, and complete complex work from one interface.

This edition adds the Achuan AI name and logo, a deep-purple visual theme, the “Your Personal AI Assistant” home slogan, and a quick-start guide above the chat area.

### Features

- **Multi-model AI chat**: Select and use different AI models from one interface.
- **Quick-start guide**: Get started in three steps—choose a model, enter a question, and receive an answer.
- **Agent management**: Create and configure dedicated agents with different roles, models, and capabilities.
- **Task workflows**: Create, track, and manage tasks carried out by agents.
- **Resources and knowledge bases**: Manage files, knowledge bases, and other contextual resources for agents.
- **Tools and plugins**: Extend search, content processing, and automation through tool calls and plugins.
- **Personalized memory**: Maintain manageable context and preferences for more consistent interactions.
- **Custom branding**: Use the Achuan AI name, logo, deep-purple theme, and customized home content.

### Installation

#### 1. Prerequisites

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/): use the `lts/krypton` version specified in `.nvmrc`
- [pnpm](https://pnpm.io/): this repository pins version `10.33.0`
- [Bun](https://bun.sh/): required for the complete development server
- [Docker Desktop](https://www.docker.com/products/docker-desktop/): required only for the full backend, database, and storage stack

#### 2. Clone the Repository

```bash
git clone https://github.com/Achuan-1/lobehub.git
cd lobehub
git switch canary
```

#### 3. Install Dependencies

```bash
corepack enable
corepack prepare pnpm@10.33.0 --activate
pnpm install
```

#### 4. Configure the Development Environment

macOS / Linux:

```bash
cp .env.example.development .env.development.local
```

Windows PowerShell:

```powershell
Copy-Item .env.example.development .env.development.local
```

Edit `.env.development.local` and replace every `REPLACE_WITH_*` placeholder with an independent, cryptographically strong value. You can run `openssl rand -base64 32` separately for `KEY_VAULTS_SECRET` and `AUTH_SECRET`. Configure at least one model provider key, such as `OPENAI_API_KEY`, and never commit the generated local environment file.

#### 5. Start the Project

Frontend-only preview:

```bash
pnpm dev:spa
```

The default URL is `http://localhost:9876/`. If the port is already in use, open the actual URL printed in the terminal.

Full development environment:

```bash
pnpm dev:docker
pnpm db:migrate
pnpm dev
```

Full mode normally starts both the Next.js service and the Vite frontend. Use the exact URLs printed in the terminal.

### Usage

1. Open the local URL shown in the terminal.
2. Select an AI model above or inside the chat composer.
3. Enter a question or task and send the message.
4. Wait for the generated response and continue the conversation as needed.
5. Use the sidebar to access Tasks, Resources, Generation, Pages, and Memory.
6. To use additional models, add the provider API key in Settings or configure it through environment variables.

Press `Ctrl+C` in the service terminal to stop the development server.

## Acknowledgements

Achuan AI is customized from [LobeHub](https://github.com/lobehub/lobehub). Thanks to the LobeHub maintainers and open-source community.

## License

This repository follows the license terms included in the upstream project. See [LICENSE](./LICENSE) for details.
