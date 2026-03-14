# Backend Architecture Guide

This document defines the coding standards and architecture for the Electron main process backend.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           RENDERER (React)                              │
│                   Sends requests via window.electronAPI                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            PRELOAD BRIDGE                               │
│              Exposes typed APIs via contextBridge                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        MAIN PROCESS (Node.js)                          │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────┐ │
│  │    IPC      │───▶│   SERVICE    │───▶│   SCHEMA    │───▶│ PRISMA  │ │
│  │  HANDLER    │    │  (Logic)    │    │   (Zod)     │    │   ORM   │ │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────┘ │
│         │                  │                  │                           │
│         ▼                  ▼                  ▼                           │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                   │
│  │  ipcWrapper │    │   Utils     │    │  Prisma     │                   │
│  │  (Errors)   │    │             │    │  Queries    │                   │
│  └─────────────┘    └─────────────┘    └─────────────┘                   │
└─────────────────────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

| Layer | Responsibility | Location |
|-------|---------------|----------|
| **IPC Handler** | Validate input (Zod), call service, return response | `src/main/ipc/*.ipc.js` |
| **Service** | Business logic, data transformation, Prisma queries | `src/main/services/*.service.js` |
| **Schema** | Zod validation definitions | `src/main/schemas/*.schema.js` |

**No controller layer** - IPC handlers directly validate and call services.

## File Structure

```
src/main/
├── ipc/
│   ├── index.js              # Register all IPC handlers
│   ├── ipcWrapper.js         # Central error handling wrapper
│   ├── auth.ipc.js           # Auth IPC handlers
│   ├── user.ipc.js           # User IPC handlers
│   └── product.ipc.js       # Product IPC handlers
├── services/
│   ├── auth.service.js       # Auth business logic
│   ├── user.service.js      # User data operations
│   └── product.service.js    # Product data operations
├── schemas/
│   ├── auth.schema.js        # Auth Zod schemas
│   ├── user.schema.js        # User Zod schemas
│   └── product.schema.js     # Product Zod schemas
├── utils/
│   ├── apiError.util.js      # Custom error class
│   └── helpers.util.js       # Utility functions
├── auth/
│   └── session.js            # Session management
└── db.js                     # Prisma client instance
```

---

## IPC Handler Pattern

**CORRECT** - Always use `ipcHandler` wrapper + Zod validation:

```javascript
// src/main/ipc/auth.ipc.js
import { ipcMain } from "electron";
import { loginService, logoutService, getCurrentUserService } from "../services/auth.service.js";
import { loginSchema } from "../schemas/auth.schema.js";
import { ipcHandler } from "./ipcWrapper.js";

export function registerAuthIPC() {
  ipcMain.handle(
    "auth:login",
    ipcHandler(async (payload) => {
      const validatedData = loginSchema.parse(payload);
      return await loginService(validatedData);
    })
  );

  ipcMain.handle(
    "auth:logout",
    ipcHandler(async () => {
      return await logoutService();
    })
  );

  ipcMain.handle(
    "auth:currentUser",
    ipcHandler(async () => {
      return await getCurrentUserService();
    })
  );
}
```

**Register in index.js:**

```javascript
// src/main/ipc/index.js
import { registerAuthIPC } from "./auth.ipc.js";
import { registerUserIPC } from "./user.ipc.js";
import { registerProductIPC } from "./product.ipc.js";

export function registerIPCHandlers() {
  registerAuthIPC();
  registerUserIPC();
  registerProductIPC();
}
```

---

## Service Pattern

Services contain business logic and interact with Prisma.

```javascript
// src/main/services/auth.service.js
import ApiError from "../utils/apiError.util.js";
import prisma from "../db.js";
import bcrypt from "bcryptjs";
import { clearSession, getSession, setSession } from "../auth/session.js";

export async function loginService(data) {
  const { username, password } = data;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new ApiError("Invalid credentials", 401);
  }

  const session = {
    id: user.id,
    username: user.username,
  };

  await setSession(session);

  return {
    success: true,
    message: "Login successful",
    user: getSession(),
  };
}

export async function logoutService() {
  clearSession();
  return { success: true };
}

export function getCurrentUserService() {
  return getSession();
}
```

---

## Zod Schema Pattern

### Simple Schema

```javascript
// src/main/schemas/auth.schema.js
import z from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
```

### Complex Schema (Nested Objects)

For FBR-compliant invoices with meta + line items:

```javascript
// src/main/schemas/invoice.schema.js
import z from "zod";

export const invoiceLineItemSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  productUomId: z.string().uuid("Invalid unit of measure").optional(),
  batchId: z.string().uuid("Invalid batch ID").optional(),
  quantity: z.number().positive("Quantity must be positive"),
  unitPrice: z.number().min(0, "Unit price cannot be negative"),
  discountPercent: z.number().min(0).max(100).default(0),
  taxRate: z.number().min(0).max(100).default(18),
  taxType: z.enum(["GST", "SRB", "EXCISE"]).default("GST"),
});

export const createInvoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  invoiceDate: z.string().datetime("Invalid date format"),
  customerName: z.string().min(1, "Customer name is required"),
  customerCnic: z.string().regex(/^\d{13}$/, "CNIC must be 13 digits").optional(),
  customerNtn: z.string().regex(/^\d{7,9}$/, "NTN must be 7-9 digits").optional(),
  customerPhone: z.string().regex(/^03\d{9}$/, "Invalid Pakistani mobile number").optional(),
  customerAddress: z.string().optional(),
  paymentStatus: z.enum(["PAID", "PARTIAL", "UNPAID"]).default("UNPAID"),
  paymentMethod: z.enum(["CASH", "CARD", "BANK_TRANSFER", "CREDIT"]).optional(),
  discountPercent: z.number().min(0).max(100).default(0),
  notes: z.string().optional(),
  lineItems: z.array(invoiceLineItemSchema).min(1, "At least one line item is required"),
});

export const updateInvoiceSchema = createInvoiceSchema.partial().extend({
  id: z.string().uuid("Invalid invoice ID"),
});

export const invoiceFilterSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  customerName: z.string().optional(),
  paymentStatus: z.enum(["PAID", "PARTIAL", "UNPAID"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
```

---

## Error Handling

### Custom ApiError

```javascript
// src/main/utils/apiError.util.js
export default class ApiError extends Error {
  constructor(message, status = 400, errors = null) {
    super(message);
    this.status = status;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, errors) {
    return new ApiError(message, 400, errors);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(message, 401);
  }

  static notFound(message = "Resource not found") {
    return new ApiError(message, 404);
  }

  static conflict(message) {
    return new ApiError(message, 409);
  }
}
```

### IPC Wrapper (Error Handling)

```javascript
// src/main/ipc/ipcWrapper.js
import { ZodError } from "zod";
import ApiError from "../utils/apiError.util.js";

export function ipcHandler(handler) {
  return async (event, payload) => {
    try {
      const result = await handler(payload, event);
      return {
        success: true,
        data: result,
      };
    } catch (err) {
      if (err instanceof ApiError) {
        return {
          success: false,
          message: err.message,
          errors: err.errors,
          status: err.status,
        };
      }

      if (err instanceof ZodError) {
        return {
          success: false,
          message: err.issues[0]?.message || "Validation Failed",
          errors: err.flatten().fieldErrors,
          status: 400,
        };
      }

      console.error("Unhandled IPC error:", err);

      return {
        success: false,
        message: "Internal server error",
        status: 500,
      };
    }
  };
}
```

---

## Transaction Pattern (Multiple Operations)

For invoice creation with stock deduction:

```javascript
// src/main/services/invoice.service.js
import prisma from "../db.js";
import ApiError from "../utils/apiError.util.js";

export async function createInvoiceService(data) {
  return await prisma.$transaction(async (tx) => {
    let totalBeforeTax = 0;
    let totalTax = 0;

    for (const item of data.lineItems) {
      const lineTotal = item.quantity * item.unitPrice;
      const discount = lineTotal * (item.discountPercent / 100);
      const taxableAmount = lineTotal - discount;
      const lineTax = taxableAmount * (item.taxRate / 100);

      totalBeforeTax += taxableAmount;
      totalTax += lineTax;

      await tx.stockMove.create({
        data: {
          productId: item.productId,
          productUomId: item.productUomId,
          batchId: item.batchId,
          type: "SALE",
          quantityBase: item.quantity,
          reference: data.invoiceNumber,
        },
      });
    }

    const discountAmount = totalBeforeTax * ((data.discountPercent || 0) / 100);
    const grandTotal = totalBeforeTax - discountAmount + totalTax;

    const invoice = await tx.invoice.create({
      data: {
        invoiceNumber: data.invoiceNumber,
        invoiceDate: new Date(data.invoiceDate),
        customerName: data.customerName,
        customerCnic: data.customerCnic,
        customerNtn: data.customerNtn,
        customerPhone: data.customerPhone,
        paymentStatus: data.paymentStatus,
        paymentMethod: data.paymentMethod,
        discountPercent: data.discountPercent || 0,
        totalBeforeTax,
        totalTax,
        grandTotal,
        lineItems: {
          create: data.lineItems.map((item) => ({
            productId: item.productId,
            productUomId: item.productUomId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discountPercent: item.discountPercent,
            taxRate: item.taxRate,
            taxType: item.taxType,
          })),
        },
      },
      include: {
        lineItems: true,
      },
    });

    return invoice;
  });
}
```

---

## Channel Naming Convention

Use format: `resource:action`

| Action | Description |
|--------|-------------|
| `create` | Create new resource |
| `list` | Get list with optional filters |
| `get` | Get single resource by ID |
| `update` | Update existing resource |
| `delete` | Soft delete (set isActive = false) |
| `hardDelete` | Permanent deletion |
| `search` | Full-text search |

Examples:
- `product:create`, `product:list`, `product:get`, `product:update`, `product:delete`
- `invoice:create`, `invoice:list`, `invoice:get`
- `customer:create`, `customer:search`

---

## Common Zod Patterns

### Pakistani-Specific Validations

```javascript
// Pakistani phone: 03XX XXXXXXX
export const pakPhone = z.string().regex(/^03\d{9}$/, "Invalid Pakistani mobile number");

// Pakistani CNIC: 13 digits
export const pakCnic = z.string().regex(/^\d{13}$/, "CNIC must be 13 digits");

// Pakistani NTN: 7-9 digits
export const pakNtn = z.string().regex(/^\d{7,9}$/, "NTN must be 7-9 digits");

// Currency: Pakistan Rupees (max 2 decimal places)
export const pakCurrency = z.number()
  .min(0, "Amount cannot be negative")
  .max(999999999, "Amount exceeds maximum limit");
```

### Optional Fields

```javascript
z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  phone: pakPhone.optional(),
});
```

### Enum Fields

```javascript
z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]),
  taxType: z.enum(["GST", "SRB", "EXCISE", "NONE"]),
  paymentMethod: z.enum(["CASH", "CARD", "BANK_TRANSFER", "CREDIT"]),
});
```

---

## Adding New Feature Checklist

Before creating any new feature:

- [ ] Create Zod schema in `src/main/schemas/`
- [ ] Create service in `src/main/services/`
- [ ] Create IPC handler in `src/main/ipc/`
- [ ] Register IPC in `src/main/ipc/index.js`
- [ ] Register preload API in `src/preload/index.js`
- [ ] Test error cases (invalid data, not found, etc.)

---

## Quick Reference

| Need | Look Here |
|------|-----------|
| Add new CRUD | Create schema → service → IPC |
| Add validation | Edit schema file |
| Add business logic | Edit service file |
| Handle errors | Edit ipcWrapper.js or create ApiError |
| Add utility | Create in utils/ or add to helpers.util.js |
