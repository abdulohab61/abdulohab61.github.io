import { searchEngines, searchInAllEngines, searchInEngine } from "./search.js";
import { BookmarkManager } from "./bookmarks.js";
import { refreshBookmarksData } from "./data-loader.js";
import { isValidURL } from "./utils.js";

// Global variables (will be injected)
let bookmarkManager: BookmarkManager;
let searchInput: HTMLInputElement;
let handleSearch: (e: Event) => void;
let renderCategories: () => Promise<void>;

// Initialize keyboard handlers with dependencies
export function initKeyboardHandlers(
  bm: BookmarkManager,
  si: HTMLInputElement,
  hs: (e: Event) => void,
  rc: () => Promise<void>
): void {
  bookmarkManager = bm;
  searchInput = si;
  handleSearch = hs;
  renderCategories = rc;
}

// Handle keyboard navigation
export function handleKeyboard(e: KeyboardEvent): void {
  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      bookmarkManager.navigateDown();
      break;
    case "ArrowUp":
      e.preventDefault();
      bookmarkManager.navigateUp();
      break;
    case "Enter":
      e.preventDefault();
      const query = searchInput.value.trim();
      const selectedIndex = bookmarkManager.getSelectedIndex();
      const currentBookmarks = bookmarkManager.getCurrentBookmarks();
      const hasSelectedBookmark =
        selectedIndex >= 0 && currentBookmarks[selectedIndex];

      if (e.ctrlKey || e.metaKey) {
        // Ctrl+Enter or Cmd+Enter: Search in all engines
        if (query) {
          searchInAllEngines(query);
        }
      } else if (query) {
        // If there's text in search box, prioritize search over bookmark selection
        if (isValidURL(query)) {
          bookmarkManager.openBookmark(query);
        } else {
          // Search on QuackQuackGo
          const engine = searchEngines.find((e) => e.name === "QuackQuackGo");
          if (engine) {
            searchInEngine(query, engine);
          }
        }
      } else if (hasSelectedBookmark) {
        // Only open bookmark if search box is empty AND bookmark is selected
        bookmarkManager.openSelected();
      }
      break;
    case "Escape":
      e.preventDefault();
      searchInput.value = "";
      handleSearch(e);
      searchInput.focus();
      break;
    case "Tab":
      e.preventDefault();
      // Tab key: Start bookmark navigation (select first bookmark)
      const bookmarkItems = document.querySelectorAll(".bookmark-item");
      if (bookmarkItems.length > 0) {
        const currentIndex = bookmarkManager.getSelectedIndex();

        // If no bookmark is currently selected, clear search and select the first one
        if (currentIndex === -1) {
          // Clear search input to enable bookmark navigation
          searchInput.value = "";
          handleSearch(e); // Update the display

          bookmarkManager.resetSelection();
          bookmarkManager.navigateDown(); // This will select first bookmark (index 0)
        } else {
          // If already navigating, move to next bookmark
          bookmarkManager.navigateDown();
        }
      }
      break;
    case "q":
      if (e.ctrlKey) {
        e.preventDefault();
        // Ctrl+q: Select first bookmark
        const bookmarkItems = document.querySelectorAll(".bookmark-item");
        if (bookmarkItems.length > 0) {
          bookmarkManager.resetSelection();
          bookmarkManager.navigateDown(); // This will select first bookmark (index 0)
        }
      }
      break;
    case "F2":
      e.preventDefault();
      // F2 key: Alternative bookmark navigation
      bookmarkManager.navigateNext();
      break;
  }
}

// Refresh bookmarks data
export async function refreshData(): Promise<void> {
  try {
    await refreshBookmarksData();

    // Re-render categories in case new ones were added
    await renderCategories();

    // Refresh existing bookmark manager instead of creating new one
    bookmarkManager.refreshData();

    // Reset category filter to "all"
    bookmarkManager.filterByCategory("all");

    // Re-render bookmarks
    bookmarkManager.renderBookmarks(bookmarkManager.getCurrentBookmarks());

    console.log("Bookmarks data refreshed successfully!");

    // Show a temporary notification
  } catch (error) {
    console.error("Failed to refresh bookmarks:", error);
  }
}

// Handle global keyboard shortcuts
export function handleGlobalKeyboard(e: KeyboardEvent): void {
  if (e.target === searchInput) return;

  // Refresh data with Ctrl+R or F5
  if ((e.ctrlKey && e.key === "r") || e.key === "F5") {
    e.preventDefault();
    refreshData();
    return;
  }

  // Focus search input on any key press
  if (e.key.length === 1 || e.key === "Backspace") {
    searchInput.focus();
  }
}
