import yaml from "js-yaml";

// Types
export interface Bookmark {
  title: string;
  url: string;
  category: string;
  icon: string;
  description: string;
}

interface BookmarksData {
  categories: string[];
  categoryColors: Record<string, string>;
  bookmarks: Bookmark[];
}

// Load YAML data
async function loadBookmarksData(): Promise<BookmarksData> {
  try {
    // Add cache busting to ensure fresh data
    const timestamp = new Date().getTime();
    const response = await fetch(`./bookmarks.yml?t=${timestamp}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch bookmarks.yml: ${response.status}`);
    }
    const yamlText = await response.text();
    const data = yaml.load(yamlText) as BookmarksData;

    return data;
  } catch (error) {
    console.error("Error loading bookmarks data:", error);
    // Return fallback empty data instead of throwing
    return {
      categories: ["all", "dev", "social", "tools"],
      categoryColors: { dev: "10", social: "11", tools: "13" },
      bookmarks: [],
    };
  }
}

// Export the loaded data
let bookmarksData: BookmarksData | null = null;

export async function getBookmarksData(): Promise<BookmarksData> {
  if (!bookmarksData) {
    bookmarksData = await loadBookmarksData();
    // Update the synchronous exports
    await updateSynchronousExports();
  }
  return bookmarksData;
}

// Function to refresh data (clear cache and reload)
export async function refreshBookmarksData(): Promise<BookmarksData> {
  bookmarksData = null; // Clear cache
  return await getBookmarksData();
}

export async function getSampleBookmarks(): Promise<Bookmark[]> {
  const data = await getBookmarksData();
  return data.bookmarks;
}

export async function getCategoryColors(): Promise<Record<string, string>> {
  const data = await getBookmarksData();
  return data.categoryColors;
}

export async function getCategories(): Promise<string[]> {
  const data = await getBookmarksData();
  return data.categories;
}

// For backward compatibility, export the data as before
export let sampleBookmarks: Bookmark[] = [];
export let categoryColors: Record<string, string> = {};

// Update synchronous exports after data is loaded
async function updateSynchronousExports(): Promise<void> {
  if (bookmarksData) {
    sampleBookmarks.length = 0;
    sampleBookmarks.push(...bookmarksData.bookmarks);

    Object.keys(categoryColors).forEach((key) => delete categoryColors[key]);
    Object.assign(categoryColors, bookmarksData.categoryColors);

    // Dispatch custom event to notify components
    window.dispatchEvent(
      new CustomEvent("bookmarksUpdated", {
        detail: {
          bookmarks: sampleBookmarks,
          categoryColors: categoryColors,
        },
      })
    );
  }
}
