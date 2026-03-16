# Frontend Architecture Guide

This document defines the coding standards and file organization for the React frontend.

## Directory Structure

```
src/renderer/
├── components/          # Reusable UI components
│   ├── ui/            # Base UI components (shadcn/ui)
│   └── dashboard/     # Dashboard-specific components
├── context/           # React context providers
├── lib/               # Utility functions
├── pages/             # Page components
│   └── dashboard/     # Dashboard pages
│       ├── inventory/
│       │   └── product/
│       └── invoice/
│           └── sale/
├── routes/            # React Router configuration
├── App.jsx            # Root component
├── index.css          # Global styles
└── main.jsx          # Entry point
```

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| **Pages** | CamelCase, first capital | `CreateSaleInvoice.jsx`, `Settings.jsx`, `Dashboard.jsx` |
| **UI Components** | CamelCase, first capital | `Button.jsx`, `Card.jsx`, `Sidebar.jsx` |
| **Context** | Kebab-case | `theme-context.jsx`, `auth-context.jsx` |
| **Reducers/Data** | Kebab-case | `sale-reducer.js`, `sale-data.js` |
| **Utils** | Kebab-case | `utils.js` |
| **Routes** | CamelCase, first capital | `index.jsx`, `ProtectedRoute.jsx` |
| **Config** | Kebab-case | - |

## Component Patterns

### Page Components

Pages are the top-level routes that users navigate to. They should be simple and delegate logic to hooks/reducers.

```jsx
// Good: Clean page component
import { useSaleReducer } from "./sale-reducer";

export default function CreateSaleInvoice() {
  const { state, activeOrder, actions } = useSaleReducer();
  
  return <div>...</div>;
}
```

### UI Components

Located in `components/ui/`. Use shadcn/ui patterns with variants.

```jsx
// components/ui/button.jsx
export function Button({ variant = "default", size = "default", ...props }) {
  return <button className={cn(buttonVariants({ variant, size }))} {...props} />;
}
```

### Context Providers

Located in `context/`. Use kebab-case naming.

```jsx
// context/theme-context.jsx
export function ThemeProvider({ children, ...props }) {
  const [theme, setTheme] = useState("light");
  return <ThemeContext.Provider value={{ theme, setTheme }} {...props}>{children}</ThemeContext.Provider>;
}
```

### Reducers / Data Logic

Business logic in pages should use custom hooks/reducers in kebab-case files.

```
pages/dashboard/invoice/sale/
├── CreateSaleInvoice.jsx   # Page component
├── sale-reducer.js        # useReducer + actions
└── sale-data.js           # Mock data + helpers
```

```javascript
// sale-reducer.js
export function useSaleReducer() {
  const [state, dispatch] = useReducer(saleReducer, initialState);
  const actions = {
    addItem: (orderId, product) => dispatch({ type: "ADD_ITEM", payload: { orderId, product } }),
    // ...
  };
  return { state, activeOrder, actions };
}
```

## Import Aliases

Use path aliases for cleaner imports:

| Alias | Path |
|-------|------|
| `@/renderer/*` | `src/renderer/*` |
| `@/components/*` | `src/renderer/components/*` |
| `@/ui/*` | `src/renderer/components/ui/*` |

```jsx
// Good
import { Button } from "@/renderer/components/ui/button";
import { useTheme } from "@/renderer/context/theme-context";

// Avoid
import { Button } from "../../components/ui/button";
```

## State Management

### Local State
- Use `useState` for simple component state
- Use `useReducer` for complex state with multiple actions

### Global State
- Use React Context for truly global state (theme, auth)
- Keep context providers in `context/` directory

## Styling

### CSS Variables
- Define theme colors in `index.css`
- Use Tailwind CSS utility classes
- Custom colors via CSS custom properties

```css
/* index.css */
.main-light {
  --primary: oklch(0.55 0.22 560);
  --background: oklch(0.985 0.002 270);
}
```

### Tailwind Classes
- Use utility classes for styling
- Create reusable components to avoid repetition
- Use `cn()` utility for conditional class merging

```jsx
import { cn } from "@/renderer/lib/utils";

<Button className={cn("px-4", isActive && "bg-primary")} />
```

## Component Guidelines

### Keep Components Small
- One component per file
- Extract reusable logic into custom hooks
- Use composition over props drilling

### Naming Conventions
- **Components**: Noun-like, PascalCase (`Sidebar`, `Navbar`)
- **Hooks**: camelCase, start with `use` (`useAuth`, `useTheme`)
- **Utilities**: kebab-case (`format-currency.js`)

### Props Patterns
- Use object destructuring
- Provide default values for optional props
- Document complex props with JSDoc

```jsx
// Good
export function Button({ 
  variant = "default", 
  size = "md", 
  children, 
  className 
}) {
  return <button className={cn(buttonVariants({ variant, size }), className)}>{children}</button>;
}
```

## Quick Reference

| Need | Location | File Naming |
|------|----------|-------------|
| New page | `pages/dashboard/` | PascalCase (`SalesList.jsx`) |
| New UI component | `components/ui/` | PascalCase (`Modal.jsx`) |
| Global state | `context/` | kebab-case (`user-context.jsx`) |
| Page logic | Same as page | kebab-case (`sales-reducer.js`) |
| Helpers | `lib/` | kebab-case (`formatters.js`) |
| Routes | `routes/` | PascalCase (`index.jsx`) |
