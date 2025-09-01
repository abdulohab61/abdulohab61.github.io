import type { Bookmark } from "./data-loader.js";
import { sampleBookmarks } from "./data-loader.js";
import { getCategoryColor } from "./utils.js";

export class BookmarkManager {
  private bookmarks: Bookmark[] = [];
  private currentBookmarks: Bookmark[] = [];
  private selectedIndex: number = -1; // -1 means no bookmark selected

  // DOM elements
  private bookmarksContainer: HTMLElement;
  private noResults: HTMLElement;

  constructor() {
    this.bookmarksContainer = document.getElementById("bookmarksContainer")!;
    this.noResults = document.getElementById("noResults")!;

    // Load initial data
    this.refreshData();

    // Listen for bookmark updates
    window.addEventListener("bookmarksUpdated", () => {
      this.refreshData();
      this.renderBookmarks(this.getCurrentBookmarks());
    });
  }

  // Refresh data from the global sampleBookmarks
  refreshData(): void {
    this.bookmarks = [...sampleBookmarks];
    this.currentBookmarks = [...sampleBookmarks];
  }

  // Render bookmarks to DOM
  renderBookmarks(bookmarks: Bookmark[]): void {
    if (bookmarks.length === 0) {
      this.bookmarksContainer.classList.add("hidden");
      this.noResults.classList.remove("hidden");
      return;
    }

    this.bookmarksContainer.classList.remove("hidden");
    this.noResults.classList.add("hidden");

    this.bookmarksContainer.innerHTML = bookmarks
      .map(
        (bookmark, index) => `
          <div class="bookmark-item bg-nord-1 bg-opacity-60 rounded-xl p-6 cursor-pointer border border-nord-2 hover:border-nord-7 transition-all" 
               data-index="${index}" 
               onclick="window.bookmarkManager.openBookmark('${bookmark.url}')">
              <div class="flex items-start space-x-4">
                  <div class="text-3xl flex-shrink-0">${bookmark.icon}</div>
                  <div class="flex-1 min-w-0">
                      <h3 class="font-semibold text-lg text-nord-6 mb-1 truncate">${
                        bookmark.title
                      }</h3>
                      <p class="text-nord-4 text-sm mb-2 line-clamp-2">${
                        bookmark.description
                      }</p>
                      <div class="flex items-center space-x-2">
                          <span class="text-xs px-2 py-1 bg-nord-${getCategoryColor(
                            bookmark.category
                          )} text-nord-0 rounded-full font-medium">
                              ${bookmark.category}
                          </span>
                          <span class="text-xs text-nord-4 opacity-60 truncate">${
                            bookmark.url
                          }</span>
                      </div>
                  </div>
              </div>
          </div>
        `
      )
      .join("");

    this.currentBookmarks = bookmarks;
  }

  // Filter bookmarks by search query
  searchBookmarks(query: string): void {
    if (query === "") {
      const activeCategory = document
        .querySelector(".category-btn.active")
        ?.getAttribute("data-category") as string;
      this.filterByCategory(activeCategory || "all");
    } else {
      const filtered = this.bookmarks.filter(
        (bookmark) =>
          bookmark.title.toLowerCase().includes(query) ||
          bookmark.description.toLowerCase().includes(query) ||
          bookmark.url.toLowerCase().includes(query)
      );
      this.renderBookmarks(filtered);
    }
    this.selectedIndex = 0;
    this.updateSelection();
  }

  // Filter bookmarks by category
  filterByCategory(category: string): void {
    // Get fresh category buttons (in case they were dynamically created)
    const categoryButtons = document.querySelectorAll(".category-btn");

    // Update active button
    categoryButtons.forEach((btn) => {
      btn.classList.remove("active", "bg-nord-8", "text-nord-0");
      btn.classList.add("bg-nord-2", "text-nord-4");
    });

    const activeBtn = document.querySelector(
      `[data-category="${category}"]`
    ) as HTMLButtonElement;
    if (activeBtn) {
      activeBtn.classList.add("active", "bg-nord-8", "text-nord-0");
      activeBtn.classList.remove("bg-nord-2", "text-nord-4");
    }

    // Filter bookmarks
    if (category === "all") {
      this.currentBookmarks = this.bookmarks;
    } else {
      this.currentBookmarks = this.bookmarks.filter(
        (bookmark) => bookmark.category === category
      );
    }
    this.renderBookmarks(this.currentBookmarks);
  }

  // Update visual selection for keyboard navigation
  updateSelection(): void {
    document.querySelectorAll(".bookmark-item").forEach((item, index) => {
      if (index === this.selectedIndex && this.selectedIndex >= 0) {
        item.classList.add("ring-2", "ring-nord-8", "bg-opacity-80");
      } else {
        item.classList.remove("ring-2", "ring-nord-8", "bg-opacity-80");
      }
    });
  }

  // Keyboard navigation
  navigateUp(): void {
    if (this.selectedIndex <= 0) {
      this.selectedIndex = -1; // Go to no selection
    } else {
      this.selectedIndex = this.selectedIndex - 1;
    }
    this.updateSelection();
  }

  navigateDown(): void {
    const bookmarkItems = document.querySelectorAll(".bookmark-item");
    if (this.selectedIndex < 0) {
      this.selectedIndex = 0; // Start from first bookmark
    } else {
      this.selectedIndex = Math.min(
        this.selectedIndex + 1,
        bookmarkItems.length - 1
      );
    }
    this.updateSelection();
  }

  navigateNext(): void {
    const bookmarkItems = document.querySelectorAll(".bookmark-item");
    if (bookmarkItems.length === 0) return;

    if (this.selectedIndex < 0) {
      this.selectedIndex = 0; // Start from first bookmark
    } else {
      this.selectedIndex = (this.selectedIndex + 1) % bookmarkItems.length;
    }
    this.updateSelection();
  }

  // Open selected bookmark
  openSelected(): void {
    if (this.selectedIndex >= 0 && this.currentBookmarks[this.selectedIndex]) {
      const url = this.currentBookmarks[this.selectedIndex].url;
      this.openBookmark(url);
    }
  }

  // Open bookmark (will be bound to window)
  openBookmark(url: string): void {
    // Add visual feedback
    const goose = document.querySelector(".goose-dance") as HTMLElement;
    if (goose) {
      goose.style.animation = "dance 0.5s ease-in-out 2";
    }

    // Open URL in new tab
    const finalUrl = url.startsWith("http") ? url : `https://${url}`;
    window.open(finalUrl, "_blank");
  }

  // Get current bookmarks
  getCurrentBookmarks(): Bookmark[] {
    return this.currentBookmarks;
  }

  // Get selected index
  getSelectedIndex(): number {
    return this.selectedIndex;
  }

  // Reset selected index
  resetSelection(): void {
    this.selectedIndex = -1; // No bookmark selected
    this.updateSelection();
  }
}
