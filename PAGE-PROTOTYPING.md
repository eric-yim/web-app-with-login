# Page Prototyping Guidelines

## Overview

When deciding on new frontend features or UI changes, we create prototype pages to compare variations before implementing in production. This allows the team to evaluate different UX approaches without affecting the live site.

## Process

1. **Create test routes**: Add prototype pages at `/test1`, `/test2`, `/test3` (up to 5 variations if needed)
2. **Use mock data**: Prototypes should NOT call the backend - use hardcoded sample data
3. **Run locally**: View prototypes with `npm run dev` at `localhost:5173/test1`, etc.
4. **Review and decide**: Manager reviews all variations and picks the best approach
5. **Implement winner**: Apply the chosen design to the actual component
6. **Clean up**: Remove test routes before deploying to production

## Guidelines for Prototype Pages

### Do:
- Use realistic mock data (real-looking usernames, links, bios)
- Make each variation meaningfully different (layout, colors, interactions)
- Keep prototypes self-contained (no backend dependencies)
- Test on mobile viewport sizes too

### Don't:
- Deploy test routes to production
- Call actual API endpoints
- Share test routes externally
- Over-engineer prototypes (they're throwaway code)

## File Structure (React Router v7 Framework Mode)

The frontend uses React Router v7 framework mode. Prototypes require TWO parts:

### 1. Prototype Components (the actual UI)
```
frontend/src/pages/prototypes/
├── Test1.jsx    # Variation 1
├── Test2.jsx    # Variation 2
├── Test3.jsx    # Variation 3
└── mockData.js  # Shared mock data
```

### 2. Route Wrappers (register the routes)
```
frontend/app/routes/
├── test1.jsx    # Wrapper that imports Test1
├── test2.jsx    # Wrapper that imports Test2
└── test3.jsx    # Wrapper that imports Test3
```

### Adding New Prototype Routes

**Step 1**: Create the prototype component in `src/pages/prototypes/Test1.jsx`

**Step 2**: Create a route wrapper in `app/routes/test1.jsx`:
```jsx
/**
 * Prototype route - Test 1
 */

import Test1 from "../../src/pages/prototypes/Test1";

export default function Test1Route() {
  return <Test1 />;
}
```

**Step 3**: Register the route in `app/routes.ts` (add BEFORE the catch-all profile route):
```ts
// Prototype routes - remove before production deploy
route("test1", "routes/test1.jsx"),
route("test2", "routes/test2.jsx"),
route("test3", "routes/test3.jsx"),

// Public profile route - must be last (catch-all pattern)
route(":username/:courseSlug?", "routes/profile.jsx"),
```

### Troubleshooting

If you see "504 Outdated Optimize Dep" or module loading errors:
```bash
# Stop dev server, clear Vite cache, restart
rm -rf node_modules/.vite
npm run dev
```

## Current Prototypes

None yet. Add entries here as you create prototypes.
