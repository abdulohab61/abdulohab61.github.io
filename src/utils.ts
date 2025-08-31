import { categoryColors } from "./data-loader.js";
export type { Bookmark } from "./data-loader.js";
export { searchInAllEngines } from "./search.js";
export { sampleBookmarks, categoryColors } from "./data-loader.js";

// Check if string is a valid URL link on not chaeck
export function isValidURL(string: string): boolean {
  try {
    // Only treat as URL if it starts with protocol or has domain-like structure
    if (string.startsWith("http://") || string.startsWith("https://")) {
      new URL(string);
      return true;
    }

    // Check if it looks like a domain (contains dot and valid domain pattern)
    if (
      string.includes(".") &&
      /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(string)
    ) {
      new URL(`https://${string}`);
      return true;
    }

    return false;
  } catch (_) {
    return false;
  }
}

// Get category color for styling
export function getCategoryColor(category: string): string {
  return categoryColors[category] || "8";
}
