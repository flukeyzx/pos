# Electron IPC API Pattern

This document explains how to add new APIs and consume them in your Electron app.

## Architecture Overview

```
┌─────────────────┐         ┌──────────────┐         ┌─────────────────┐
│  Renderer       │         │  Preload     │         │  Main Process   │
│  (React/UI)     │ ◄─────► │  (Bridge)    │ ◄─────► │  (Node.js)      │
└─────────────────┘         └──────────────┘         └─────────────────┘
```

## File Structure

```
src/
├── main/
│   ├── ipc/
│   │   ├── index.ts          # Register all IPC handlers
│   │   └── user.ipc.ts       # User-specific IPC handlers
│   └── services/
│       └── user.service.ts   # Business logic
├── preload/
│   ├── index.ts              # Expose APIs to renderer
│   └── types.ts              # TypeScript definitions
└── renderer/
    ├── App.tsx               # React components
    └── vite-env.d.ts         # Global type declarations
```

## How to Add a New API

### Step 1: Create the Service (Main Process)

Create your business logic in `src/main/services/`:

```typescript
// src/main/services/product.service.ts
import prisma from "../db";

export async function createProduct(data: { name: string; price: number }) {
  return prisma.product.create({ data });
}

export async function getProducts() {
  return prisma.product.findMany();
}
```

### Step 2: Register IPC Handlers (Main Process)

Create IPC handlers in `src/main/ipc/`:

```typescript
// src/main/ipc/product.ipc.ts
import { ipcMain } from "electron";
import { createProduct, getProducts } from "../services/product.service";

export function registerProductIPC() {
  ipcMain.handle("product:create", async (_event, payload) => {
    return await createProduct(payload);
  });

  ipcMain.handle("product:list", async () => {
    return await getProducts();
  });
}
```

Register in `src/main/ipc/index.ts`:

```typescript
import { registerUserIPC } from "./user.ipc";
import { registerProductIPC } from "./product.ipc"; // Add this

export function registerIPCHandlers() {
  registerUserIPC();
  registerProductIPC(); // Add this
}
```

### Step 3: Update Type Definitions (Preload)

Add types in `src/preload/types.ts`:

```typescript
export interface Product {
  id: number;
  name: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductPayload {
  name: string;
  price: number;
}

export interface ElectronAPI {
  user: {
    create: (payload: CreateUserPayload) => Promise<User>;
    list: () => Promise<User[]>;
  };
  // Add new product API
  product: {
    create: (payload: CreateProductPayload) => Promise<Product>;
    list: () => Promise<Product[]>;
  };
}
```

### Step 4: Expose API in Preload

Update `src/preload/index.ts`:

```typescript
const electronAPI: ElectronAPI = {
  user: {
    create: (payload) => ipcRenderer.invoke("user:create", payload),
    list: () => ipcRenderer.invoke("user:list"),
  },
  // Add new product API
  product: {
    create: (payload) => ipcRenderer.invoke("product:create", payload),
    list: () => ipcRenderer.invoke("product:list"),
  },
};
```

### Step 5: Use in Renderer (React Components)

```typescript
// In any React component
const MyComponent = () => {
  const handleCreateProduct = async () => {
    const product = await window.electronAPI.product.create({
      name: "New Product",
      price: 99.99,
    });
    console.log("Created:", product);
  };

  const handleListProducts = async () => {
    const products = await window.electronAPI.product.list();
    console.log("Products:", products);
  };

  return (
    <div>
      <button onClick={handleCreateProduct}>Create Product</button>
      <button onClick={handleListProducts}>List Products</button>
    </div>
  );
};
```

## Key Benefits

✅ **Type Safety**: Full TypeScript support from renderer to main process
✅ **Security**: Only explicitly exposed APIs are available to renderer
✅ **Organized**: Clear separation of concerns
✅ **Maintainable**: Easy to add new APIs following the same pattern

## Channel Naming Convention

Use the format: `resource:action`

Examples:

- `user:create`
- `user:list`
- `user:update`
- `user:delete`
- `product:create`
- `order:list`

## Example: Current User API

### Create a User

```typescript
const newUser = await window.electronAPI.user.create({
  username: "john_doe",
  password: "secure123",
});
```

### List All Users

```typescript
const users = await window.electronAPI.user.list();
```

## Error Handling

Always wrap API calls in try-catch blocks:

```typescript
try {
  const result = await window.electronAPI.user.create(data);
  // Handle success
} catch (error) {
  console.error("Error:", error);
  // Handle error
}
```
