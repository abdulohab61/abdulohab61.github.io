import { categoryColors } from "./data-loader.js";
export type { Bookmark } from "./data-loader.js";

import {
  searchEngines,
  type SearchEngine,
  searchInAllEngines,
} from "./search.js";
export { sampleBookmarks, categoryColors } from "./data-loader.js";
export { searchInAllEngines } from "./search.js";

// Check if string is a valid URL link on not chaeck
export function isValidURL(string: string): boolean {
  try {
    new URL(string.startsWith("http") ? string : `https://${string}`);
    return true;
  } catch (_) {
    return false;
  }
}

// Get category color for styling
export function getCategoryColor(category: string): string {
  return categoryColors[category] || "8";
}

// Search in specific engine
export function searchInEngine(query: string, engine: SearchEngine): void {
  if (query.trim() === "") {
    alert("Please enter a search query.");
    return;
  }

  const url = `${engine.url}?${engine.parameter}=${encodeURIComponent(query)}`;
  window.open(url, "_blank");
}

// Get search URL for a specific engine
export function getSearchUrl(query: string, engineName: string): string {
  const engine = searchEngines.find(
    (e) => e.name.toLowerCase() === engineName.toLowerCase()
  );
  if (!engine) {
    // Default to Google
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  }
  return `${engine.url}?${engine.parameter}=${encodeURIComponent(query)}`;
}

// Open bookmark in new tab
export function openBookmark(url: string): void {
  const finalUrl = url.startsWith("http") ? url : `https://${url}`;
  window.open(finalUrl, "_blank");
}
