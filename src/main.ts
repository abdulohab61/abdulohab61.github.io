import "./style.css";
import type { Category } from "./data.js";
import { BookmarkManager } from "./bookmarks.js";
import {
  isValidURL,
  searchInEngine,
  searchInAllEngines,
  searchEngines,
} from "./utils.js";

// Global variables
let bookmarkManager: BookmarkManager;

// DOM elements
let searchInput: HTMLInputElement;

// Initialize the application
function init(): void {
  // Initialize bookmark manager
  bookmarkManager = new BookmarkManager();

  // Make it globally accessible for onclick handlers
  (window as any).bookmarkManager = bookmarkManager;

  // Get DOM elements
  searchInput = document.getElementById("searchInput") as HTMLInputElement;

  // Render initial bookmarks
  bookmarkManager.renderBookmarks(bookmarkManager.getCurrentBookmarks());

  // Setup event listeners
  setupEventListeners();

  // Focus search input on load
  searchInput.focus();
}

// Setup all event listeners
function setupEventListeners(): void {
  // Search input events
  searchInput.addEventListener("input", handleSearch);
  searchInput.addEventListener("keydown", handleKeyboard);

  // Category button events
  const categoryButtons = document.querySelectorAll(".category-btn");
  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-category") as Category;
      handleCategoryFilter(category);
    });
  });

  // Global keyboard shortcuts
  document.addEventListener("keydown", handleGlobalKeyboard);

  // Search engines event listeners
  setupSearchEngineListeners();

  // Goose personality
  addGoosePersonality();
}

// Setup search engines event listeners
function setupSearchEngineListeners(): void {
  // Individual search engine buttons
  const searchEngineButtons = document.querySelectorAll(".search-engine-btn");
  searchEngineButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const engineName = btn.getAttribute("data-engine");
      const query = searchInput.value.trim();

      if (query === "") {
        alert("Please enter a search query.");
        return;
      }

      if (engineName) {
        const engine = searchEngines.find((e) => e.name === engineName);
        if (engine) {
          searchInEngine(query, engine);
          // Clear search input after search
          searchInput.value = "";
        }
      }
    });
  });

  // Search all engines button
  const searchAllButton = document.getElementById("searchAllEngines");
  if (searchAllButton) {
    searchAllButton.addEventListener("click", () => {
      const query = searchInput.value.trim();

      if (query === "") {
        alert("Please enter a search query.");
        return;
      }

      // Update button text temporarily
      const originalText = searchAllButton.innerHTML;
      searchAllButton.innerHTML = "🚀 Searching...";
      searchAllButton.setAttribute("disabled", "true");

      // Call search function
      searchInAllEngines(query);

      // Reset button after delay
      setTimeout(() => {
        searchAllButton.innerHTML = originalText;
        searchAllButton.removeAttribute("disabled");
      }, searchEngines.length * 300 + 1000);

      // Clear search input after search
      searchInput.value = "";
    });
  }
}

// Handle search functionality
function handleSearch(e: Event): void {
  const target = e.target as HTMLInputElement;
  const query = target.value.toLowerCase().trim();
  bookmarkManager.searchBookmarks(query);
}

// Handle category filtering
function handleCategoryFilter(category: Category): void {
  // Clear search
  searchInput.value = "";

  // Filter bookmarks
  bookmarkManager.filterByCategory(category);
  bookmarkManager.resetSelection();
}

// Handle keyboard navigation
function handleKeyboard(e: KeyboardEvent): void {
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
      if (e.ctrlKey || e.metaKey) {
        // Ctrl+Enter or Cmd+Enter: Search in all engines
        const query = searchInput.value.trim();
        if (query) {
          searchInAllEngines(query);
          searchInput.value = "";
        }
      } else if (
        bookmarkManager.getCurrentBookmarks()[
          bookmarkManager.getSelectedIndex()
        ]
      ) {
        bookmarkManager.openSelected();
      } else if (searchInput.value.trim()) {
        // If typing a URL
        const query = searchInput.value.trim();
        if (isValidURL(query)) {
          bookmarkManager.openBookmark(query);
        } else {
          // Search on Google
          const engine = searchEngines.find((e) => e.name === "Google");
          if (engine) {
            searchInEngine(query, engine);
            searchInput.value = "";
          }
        }
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
      bookmarkManager.navigateNext();
      break;
  }
}

// Handle global keyboard shortcuts
function handleGlobalKeyboard(e: KeyboardEvent): void {
  if (e.target === searchInput) return;

  // Focus search input on any key press
  if (e.key.length === 1 || e.key === "Backspace") {
    searchInput.focus();
  }
}

// Add goose personality and easter eggs
function addGoosePersonality(): void {
  const goose = document.querySelector(".goose-dance") as HTMLElement;
  let clickCount = 0;

  if (!goose) return;

  goose.addEventListener("click", () => {
    clickCount++;

    if (clickCount === 1) {
      goose.textContent = "🦆";
    } else if (clickCount === 3) {
      goose.textContent = "🪿";
    } else if (clickCount === 5) {
      goose.textContent = "🦢";
      setTimeout(() => {
        goose.textContent = "🦆";
        clickCount = 0;
      }, 2000);
    }

    // Easter egg: Konami code equivalent for goose
    if (clickCount === 10) {
      document.body.style.cursor =
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='24' viewport='0 0 100 100' style='fill:black;font-size:16px;'><text y='20'>🦆</text></svg>\") 16 0, auto";
      setTimeout(() => {
        document.body.style.cursor = "auto";
      }, 5000);
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
