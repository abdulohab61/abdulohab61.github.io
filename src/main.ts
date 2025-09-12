import "./css/style.css";
import { setupSearchEngineListeners } from "./search.js";
import { BookmarkManager } from "./bookmarks.js";
import { getBookmarksData } from "./data-loader.js";
import { getCategories } from "./data-loader.js";
import { handleKeyboard, handleGlobalKeyboard } from "./handleKeyboard.js";
import { refreshData, initKeyboardHandlers } from "./handleKeyboard.js";

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

    // Create "All" button first
    const allButton = document.createElement("button");
    allButton.className = `category-btn px-4 py-2 rounded-lg bg-nord-2 text-nord-4 font-medium transition-all hover:bg-nord-3 hover:text-nord-6`;
    allButton.setAttribute("data-category", "all");
    allButton.textContent = "All";

    // Add click event listener for All button
    allButton.addEventListener("click", () => {
      // Remove active class from all buttons
      const allButtons = document.querySelectorAll(".category-btn");
      allButtons.forEach((btn) => {
        btn.className =
          "category-btn px-4 py-2 rounded-lg bg-nord-2 text-nord-4 font-medium transition-all hover:bg-nord-3 hover:text-nord-6";
      });

      // Add active class to All button
      allButton.className =
        "category-btn active px-4 py-2 rounded-lg bg-nord-8 text-nord-0 font-medium transition-all hover:bg-nord-3 hover:text-nord-6";

      // Clear search and show all bookmarks
      searchInput.value = "";
      bookmarkManager.filterByCategory("all");
      bookmarkManager.resetSelection();
    });

    categoryContainer.appendChild(allButton);

    // Create category buttons
    categories
      .filter((category) => category !== "all") // Filter out "all" to avoid duplicate
      .forEach((category) => {
        const button = document.createElement("button");
        button.className = `category-btn px-4 py-2 rounded-lg bg-nord-2 text-nord-4 font-medium transition-all hover:bg-nord-3 hover:text-nord-6`;

        button.setAttribute("data-category", category);

        // Generate display name dynamically
        const getDisplayName = (cat: string): string => {
          const specialNames: Record<string, string> = {
            ai: "AI Tools",
            pdf: "PDF Tools",
            cp: "Competitive Programming",
            torrent: "Archives",
          };

          return (
            specialNames[cat] || cat.charAt(0).toUpperCase() + cat.slice(1)
          );
        };

        button.textContent = getDisplayName(category);

        // Add click event listener
        button.addEventListener("click", () => {
          // Remove active class from all buttons
          const allButtons = document.querySelectorAll(".category-btn");
          allButtons.forEach((btn) => {
            btn.className =
              "category-btn px-4 py-2 rounded-lg bg-nord-2 text-nord-4 font-medium transition-all hover:bg-nord-3 hover:text-nord-6";
          });

          // Add active class to clicked button
          button.className =
            "category-btn active px-4 py-2 rounded-lg bg-nord-8 text-nord-0 font-medium transition-all hover:bg-nord-3 hover:text-nord-6";

          const categoryType = button.getAttribute("data-category") as string;
          handleCategoryFilter(categoryType);
        });

        categoryContainer.appendChild(button);
      });
  } catch (error) {
    console.error("Error rendering categories:", error);
  }
}

// Initialize the application
async function init(): Promise<void> {
  try {
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

    // Just refresh data without automatically showing bookmarks
    setTimeout(() => {
      bookmarkManager.refreshData();
      // Don't render bookmarks initially - wait for user interaction
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
  // Initialize keyboard handlers with dependencies
  initKeyboardHandlers(
    bookmarkManager,
    searchInput,
    handleSearch,
    renderCategories
  );

  // Search input events
  searchInput.addEventListener("input", handleSearch);
  searchInput.addEventListener("keydown", handleKeyboard);

  // Global keyboard shortcuts
  document.addEventListener("keydown", handleGlobalKeyboard);

  // Refresh button
  const refreshButton = document.getElementById("refreshData");
  if (refreshButton) {
    refreshButton.addEventListener("click", refreshData);
  }

  // Search engines event listeners
  setupSearchEngineListeners();
}

// Handle search functionality
function handleSearch(e: Event): void {
  const target = e.target as HTMLInputElement;
  const query = target.value.toLowerCase().trim();
  bookmarkManager.searchBookmarks(query);

  // Reset bookmark selection when searching
  bookmarkManager.resetSelection();
}

// Handle category filtering
function handleCategoryFilter(category: string): void {
  // Clear search
  searchInput.value = "";

  // Filter bookmarks
  bookmarkManager.filterByCategory(category);
  bookmarkManager.resetSelection();
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  init().catch((error) => {
    console.error("Application initialization failed:", error);
  });
});
