import "./css/style.css";
import { BookmarkManager } from "./bookmarks.js";
import {
  getBookmarksData,
  refreshBookmarksData,
  getCategories,
} from "./data-loader.js";
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

// Render categories dynamically from YAML data
async function renderCategories(): Promise<void> {
  try {
    const categories = await getCategories();

    // Find the category buttons container
    const categoryContainer = document.querySelector(".flex.flex-wrap.gap-2");
    if (!categoryContainer) {
      console.error("Category container not found");
      return;
    }

    // Clear existing category buttons
    categoryContainer.innerHTML = "";

    // Create category buttons
    categories.forEach((category, index) => {
      const button = document.createElement("button");
      button.className = `category-btn ${
        index === 0 ? "active" : ""
      } px-4 py-2 rounded-lg ${
        index === 0 ? "bg-nord-8 text-nord-0" : "bg-nord-2 text-nord-4"
      } font-medium transition-all hover:bg-nord-3 hover:text-nord-6`;

      button.setAttribute("data-category", category);

      // Generate display name dynamically
      const getDisplayName = (cat: string): string => {
        const specialNames: Record<string, string> = {
          ai: "AI Tools",
          pdf: "PDF Tools",
          cp: "Competitive Programming",
          torrent: "Archives",
        };

        return specialNames[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
      };

      button.textContent = getDisplayName(category);

      // Add click event listener
      button.addEventListener("click", () => {
        const categoryType = button.getAttribute("data-category") as string;
        handleCategoryFilter(categoryType);
      });

      categoryContainer.appendChild(button);
    });

    console.log(`Rendered ${categories.length} categories dynamically`);
  } catch (error) {
    console.error("Error rendering categories:", error);
  }
}

// Initialize the application
async function init(): Promise<void> {
  try {
    console.log("Initializing application...");

    // Load data first
    await getBookmarksData();

    // Render categories dynamically
    await renderCategories();

    // Initialize bookmark manager
    bookmarkManager = new BookmarkManager();

    // Make it globally accessible for onclick handlers
    (window as any).bookmarkManager = bookmarkManager;

    // Get DOM elements
    searchInput = document.getElementById("searchInput") as HTMLInputElement;

    // Ensure data is loaded in BookmarkManager
    setTimeout(() => {
      bookmarkManager.refreshData();
      bookmarkManager.renderBookmarks(bookmarkManager.getCurrentBookmarks());
    }, 100);

    // Setup event listeners
    setupEventListeners();

    // Focus search input on load
    searchInput.focus();
  } catch (error) {
    console.error("Failed to initialize application:", error);
  }
}

// Setup all event listeners
function setupEventListeners(): void {
  // Search input events
  searchInput.addEventListener("input", handleSearch);
  searchInput.addEventListener("keydown", handleKeyboard);

  // Note: Category button events are now handled in renderCategories()

  // Global keyboard shortcuts
  document.addEventListener("keydown", handleGlobalKeyboard);

  // Refresh button
  const refreshButton = document.getElementById("refreshData");
  if (refreshButton) {
    refreshButton.addEventListener("click", refreshData);
  }

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
function handleCategoryFilter(category: string): void {
  console.log("🏷️ Category filter clicked:", category);
  console.log("🔄 BookmarkManager exists:", !!bookmarkManager);

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

// Refresh bookmarks data
async function refreshData(): Promise<void> {
  try {
    console.log("Refreshing bookmarks data...");
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
    showNotification("📚 Bookmarks refreshed!", 2000);
  } catch (error) {
    console.error("Failed to refresh bookmarks:", error);
    showNotification("❌ Failed to refresh bookmarks", 3000);
  }
}

// Show notification
function showNotification(message: string, duration: number): void {
  const notification = document.createElement("div");
  notification.className =
    "fixed top-4 right-4 bg-nord-8 text-nord-0 px-4 py-2 rounded-lg shadow-lg z-50 transition-all";
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, duration);
}

// Handle global keyboard shortcuts
function handleGlobalKeyboard(e: KeyboardEvent): void {
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
document.addEventListener("DOMContentLoaded", () => {
  init().catch((error) => {
    console.error("Application initialization failed:", error);
  });
});
