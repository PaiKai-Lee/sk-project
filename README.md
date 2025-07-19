# sk_project

這是一個全端專案，使用 React (Vite) 作為前端框架，NestJS 作為後端框架。

## 功能特色

- **前端**：使用 Vite 進行建置，React 和 TypeScript 開發，整合了 Tailwind CSS & Shadcn UI Library 和國際化 i18n。
- **後端**：使用 NestJS 框架，TypeScript 編寫，透過 Prisma ORM 與資料庫進行互動。
- **驗證機制**：包含完整的 JWT 登入、權限驗證 (RBAC) 和路由守衛。
- **資料庫**：使用 Prisma 進行資料庫遷移和種子資料填充。

## 技術堆疊

- **前端**:
  - React
  - Vite
  - TypeScript
  - React Router v7
  - Tailwind CSS / Shadcn UI
  - i18next

- **後端**:
  - NestJS
  - TypeScript
  - Prisma
  - JWT (JSON Web Token)

## 系統需求

在開始之前，請確保您已安裝以下軟體：

- [Node.js](https://nodejs.org/) (建議使用 v18 或更高版本)
- [NPM](https://www.npmjs.com/) (通常隨 Node.js 一起安裝)
- [Git](https://git-scm.com/)
- 一個 Prisma 相容的資料庫 (例如：PostgreSQL, MySQL, SQLite)

## 安裝與啟動

請依照以下步驟來設定和執行此專案。

### 1. 複製專案

```bash
git clone <your-repository-url>
cd sk_projects
```

### 2. 後端設定 (Backend)

1. **進入後端目錄**

    ```bash
    cd backend
    ```

2. **安裝依賴套件**

    ```bash
    npm install
    ```

3. **設定環境變數**

    複製 `.env.example` 檔案並重新命名為 `.env`。

    ```bash
    cp .env.example .env
    ```

    接著，編輯 `.env` 檔案，至少需要設定以下變數：
    - `DATABASE_URL`: 指向您的資料庫。
    - `APP_ROOT_USER_PASSWORD`: 設定 root 帳號的初始密碼。
    - `APP_SALT_ROUNDS`: 密碼加密的 salt rounds，建議值為 10。

4. **執行資料庫遷移**

    這將根據 `prisma/schema.prisma` 的定義來更新您的資料庫結構。

    ```bash
    npx prisma migrate dev
    ```

5. **初始化資料庫 (Seeding)**

    此為 **必要** 步驟。該指令會建立預設的部門、角色、權限，並建立一個 `root` 超級管理員帳號。

    ```bash
    npx prisma db seed
    ```

    > **注意**: `root` 帳號的預設帳號為 `root`，密碼為您在 `.env` 檔案中設定的 `APP_ROOT_USER_PASSWORD`。

6. **啟動後端開發伺服器**

    ```bash
    npm run start:dev
    ```

    後端服務預設會在 `http://localhost:3000` 上執行。

### 3. 前端設定 (Frontend)

1. **進入前端目錄**

    ```bash
    cd ../frontend
    ```

2. **安裝依賴套件**

    ```bash
    npm install
    ```

3. **設定環境變數 (如果需要)**

    如果前端需要連接到後端 API，您可能需要在 `frontend` 目錄下建立一個 `.env` 檔案，並設定 `VITE_API_URL`。

    ```bash
    VITE_API_URL=http://localhost:3000
    ```

4. **啟動前端開發伺服器**

    ```bash
    npm run dev
    ```

    前端應用程式預設會在 `http://localhost:5173` (或其他 Vite 指定的 port) 上執行。

## 專案結構

- `backend/`: 包含所有後端 NestJS 應用程式的程式碼。
- `frontend/`: 包含所有前端 React 應用程式的程式碼。
