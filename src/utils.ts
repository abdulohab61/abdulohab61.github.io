import { categoryColors } from "./data.js";

// Check if string is a valid URL
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

// Open bookmark with visual feedback
export function openBookmark(url: string): void {
  // Add visual feedback
  const goose = document.querySelector(".goose-dance") as HTMLElement;
  if (goose) {
    goose.style.animation = "dance 0.5s ease-in-out 2";
  }

  // Open URL in new tab
  const finalUrl = url.startsWith("http") ? url : `https://${url}`;
  window.open(finalUrl, "_blank");
}

// Debounce function for search
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => func.apply(null, args), wait);
  };
}

// Search engines configuration
export interface SearchEngine {
  name: string;
  url: string;
  parameter: string;
  icon: string;
}

export const searchEngines: SearchEngine[] = [
  {
    name: "Google",
    url: "https://www.google.com/search",
    parameter: "q",
    icon: "🔍",
  },
  {
    name: "Bing",
    url: "https://www.bing.com/search",
    parameter: "q",
    icon: "🌐",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/results",
    parameter: "search_query",
    icon: "📺",
  },
  {
    name: "Yandex",
    url: "https://yandex.com/search",
    parameter: "text",
    icon: "🔎",
  },
  {
    name: "DuckDuckGo",
    url: "https://duckduckgo.com",
    parameter: "q",
    icon: "🦆",
  },
  {
    name: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Special:Search",
    parameter: "search",
    icon: "📖",
  },
];

// Search in specific engine
export function searchInEngine(query: string, engine: SearchEngine): void {
  if (query.trim() === "") {
    alert("Please enter a search query.");
    return;
  }

  const url = `${engine.url}?${engine.parameter}=${encodeURIComponent(query)}`;
  window.open(url, "_blank");
}

// Search in all engines
export function searchInAllEngines(query: string): void {
  console.log("searchInAllEngines called with query:", query);

  if (query.trim() === "") {
    alert("Please enter a search query.");
    return;
  }

  // Add visual feedback
  const goose = document.querySelector(".goose-dance") as HTMLElement;
  if (goose) {
    goose.style.animation = "dance 0.5s ease-in-out 3";
  }

  console.log("Opening tabs for", searchEngines.length, "search engines");

  // Show confirmation dialog
  const confirmed = confirm(
    `This will open ${searchEngines.length} tabs in your browser. Continue?`
  );

  if (!confirmed) {
    console.log("User cancelled search all");
    return;
  }

  // Open tabs with small delays to avoid popup blocker
  searchEngines.forEach((engine, index) => {
    setTimeout(() => {
      const url = `${engine.url}?${engine.parameter}=${encodeURIComponent(
        query
      )}`;
      console.log(`Opening tab ${index + 1}:`, engine.name, url);
      window.open(url, "_blank");
    }, index * 300); // 300ms delay between each tab
  });

  // Show notification
  setTimeout(() => {
    console.log("All tabs opened successfully");
    alert(`Opened ${searchEngines.length} search tabs!`);
  }, searchEngines.length * 300 + 500);
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
