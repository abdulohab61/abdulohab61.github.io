# Project Structure

This document describes the reorganized project structure after moving all CSS files to a dedicated folder and implementing YAML-based bookmark configuration.

## Directory Structure

```
OpenBookmarks/
├── bookmarks.yml                 # Main bookmark configuration (YAML)
├── public/
│   ├── bookmarks.yml            # Copy for development server
│   └── vite.svg
├── src/
│   ├── css/                     # CSS files folder
│   │   ├── style.css           # Main styles
│   │   ├── style_new.css       # Alternative styles
│   │   └── style_old.css       # Legacy styles
│   ├── bookmarks.ts            # Bookmark management logic
│   ├── data.ts                 # Data exports (backward compatibility)
│   ├── data-loader.ts          # YAML data loading logic
│   ├── main.ts                 # Application entry point
│   ├── utils.ts                # Utility functions
│   └── vite-env.d.ts          # TypeScript environment definitions
├── dist/                       # Build output
├── package.json
├── vite.config.ts
└── other config files...
```

## Key Changes Made

### 1. CSS Organization

- Created `src/css/` folder
- Moved all CSS files (`style.css`, `style_new.css`, `style_old.css`) to this folder
- Updated import path in `main.ts` from `"./style.css"` to `"./css/style.css"`

### 2. YAML-Based Configuration

- Bookmarks data moved from TypeScript to `bookmarks.yml`
- Added `data-loader.ts` for YAML parsing using `js-yaml`
- Maintained backward compatibility through `data.ts` re-exports
- Asynchronous data loading implemented in `main.ts`

### 3. File Cleanup

- Removed duplicate and backup files
- Cleaned up temporary data files

## Benefits

1. **Better Organization**: CSS files are now in a dedicated folder
2. **External Configuration**: Bookmarks can be edited without touching code
3. **Maintainability**: Clear separation of concerns
4. **Backward Compatibility**: All existing imports continue to work
5. **Build Integration**: YAML file automatically included in builds

## Usage

1. **Edit Bookmarks**: Modify `bookmarks.yml` in the root directory
2. **Development**: Run `npm run dev` (YAML auto-copied to public/)
3. **Production**: Run `npm run build` (YAML included in dist/)

## CSS Import Path

When importing CSS in TypeScript files, use:

```typescript
import "./css/style.css";
```

## Data Access

The data loading is now asynchronous. Use the async functions:

```typescript
import { getBookmarksData, getSampleBookmarks } from "./data-loader.js";

// Async usage
const bookmarks = await getSampleBookmarks();

// Or use the backward-compatible synchronous exports (after initialization)
import { sampleBookmarks } from "./data.js";
```
