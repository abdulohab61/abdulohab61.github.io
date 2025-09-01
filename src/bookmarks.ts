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
          <div class="bookmark-item group bg-nord-1 bg-opacity-80 rounded-lg p-3 cursor-pointer border border-nord-2 hover:border-nord-8 shadow-sm transition-all flex items-center gap-3" 
               data-index="${index}" 
               onclick="window.bookmarkManager.openBookmark('${bookmark.url}')">
            <div class="flex items-center gap-3 w-full">
              <div class="text-2xl flex-shrink-0 bg-nord-2 rounded-lg p-2">${
                bookmark.icon
              }</div>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-base text-nord-6 mb-0 truncate">${
                  bookmark.title
                }</h3>
                <p class="text-nord-4 text-xs mb-1 line-clamp-1">${
                  bookmark.description
                }</p>
                <span class="text-xs text-nord-4 opacity-70 truncate block overflow-hidden whitespace-nowrap">${
                  bookmark.url
                }</span>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs px-2 py-0.5 bg-nord-${getCategoryColor(
                    bookmark.category
                  )} text-nord-0 rounded font-medium">${
          bookmark.category
        }</span>
                </div>
              </div>
              <button class="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-nord-8" title="Open">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 3h7m0 0v7m0-7L10 14m-7 7h7a2 2 0 002-2v-7" /></svg>
              </button>
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
