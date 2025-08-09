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
