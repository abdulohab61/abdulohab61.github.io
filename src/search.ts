// Hear Search engines configuration
export interface SearchEngine {
  name: string;
  url: string;
  parameter: string;
}

export const searchEngines: SearchEngine[] = [
  {
    name: "Google",
    url: "https://www.google.com/search",
    parameter: "q",
  },
  {
    name: "DuckDuckGo",
    url: "https://duckduckgo.com",
    parameter: "q",
  },
  {
    name: "Brave",
    url: "https://search.brave.com/search",
    parameter: "q",
  },
  {
    name: "QuackQuackGo",
    url: "https://quackquackgo.net/",
    parameter: "q",
  },
  {
    name: "Startpage",
    url: "https://www.startpage.com/search",
    parameter: "query",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/results",
    parameter: "search_query",
  },
  {
    name: "Yandex",
    url: "https://yandex.com/search",
    parameter: "text",
  },
  {
    name: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Special:Search",
    parameter: "search",
  },
];

// Simple ALL Search button Popup selector with working buttons
function showEngineSelector(query: string): Promise<SearchEngine[] | null> {
  return new Promise((resolve) => {
    // Create modal
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 bg-opacity-70 z-50 flex items-center justify-center p-4";
    modal.innerHTML = `
      <div class="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full shadow-2xl">
        <h3 class="text-xl font-semibold text-slate-100 mb-3 flex items-center gap-2">
          🔍 Select Search Engines
        </h3>
        <p class="text-sm text-slate-400 mb-4">
          Query: <strong class="text-slate-200">"${query}"</strong>
        </p>
        <div class="max-h-60 overflow-y-auto border border-slate-600 rounded-lg p-3 mb-5">
          ${searchEngines
            .map(
              (engine, i) => `
            <label class="flex items-center py-2 px-1 cursor-pointer hover:bg-slate-700 rounded-md transition-colors">
              <input type="checkbox" checked data-index="${i}" class="mr-3 w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2">
              <span class="text-slate-200 font-medium">${engine.name}</span>
            </label>
          `
            )
            .join("")}
        </div>
        <div class="flex gap-3 justify-end">
          <button id="cancel-btn" class="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-slate-200 font-medium rounded-lg transition-colors">
            Cancel
          </button>
          <button id="search-btn" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors">
            Search
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Get buttons
    const cancelBtn = modal.querySelector("#cancel-btn") as HTMLButtonElement;
    const searchBtn = modal.querySelector("#search-btn") as HTMLButtonElement;

    // Cancel button
    cancelBtn.addEventListener("click", () => {
      modal.remove();
      resolve(null);
    });

    // Search button
    searchBtn.addEventListener("click", () => {
      const selected: SearchEngine[] = [];
      const checkboxes = modal.querySelectorAll(
        'input[type="checkbox"]:checked'
      );

      checkboxes.forEach((checkbox) => {
        const index = parseInt(
          (checkbox as HTMLInputElement).dataset.index || "0"
        );
        if (searchEngines[index]) {
          selected.push(searchEngines[index]);
        }
      });

      modal.remove();
      resolve(selected.length > 0 ? selected : null);
    });

    // ESC key for Cancel
    document.addEventListener("keydown", function escHandler(e) {
      if (e.key === "Escape") {
        modal.remove();
        document.removeEventListener("keydown", escHandler);
        resolve(null);
      }
    });

    // Click outside off
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
        resolve(null);
      }
    });
  });
}

// Search in all engines
export async function searchInAllEngines(query: string): Promise<void> {
  // Validate query
  if (query.trim() === "") {
    alert("Please enter a search query.");
    return;
  }

  // Search one by one
  searchEngines.forEach((engine, index) => {
    console.log(`${index + 1}. ${engine.name}: ${engine.url}`);
  });

  // Show engine selection dialog
  const selectedEngines = await showEngineSelector(query);
  if (!selectedEngines) return;

  // Open tabs with small delays to avoid popup blocker
  let successCount = 0;
  let failCount = 0;

  selectedEngines.forEach((engine, index) => {
    setTimeout(() => {
      const url = `${engine.url}?${engine.parameter}=${encodeURIComponent(
        query
      )}`;

      try {
        const newWindow = window.open(url, "_blank");
        if (
          !newWindow ||
          newWindow.closed ||
          typeof newWindow.closed == "undefined"
        ) {
          console.warn(`⚠️ Popup blocked: ${engine.name}`);
          failCount++;
        } else {
          successCount++;
        }
      } catch (error) {
        failCount++;
      }
    }, index * 300);
  });
}

// Setup search engines event listeners
export function setupSearchEngineListeners(): void {
  // Get search input element
  const searchInput = document.getElementById(
    "searchInput"
  ) as HTMLInputElement;

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
          // Use direct search instead of undefined function
          const url = `${engine.url}?${engine.parameter}=${encodeURIComponent(
            query
          )}`;
          window.open(url, "_blank");
          // searchInput.value = ""; // clear search disabled
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

      // Button disable after function calling
      searchAllButton.setAttribute("disabled", "true");

      // Call search function
      searchInAllEngines(query);

      // Reset button after delay
      setTimeout(() => {
        searchAllButton.removeAttribute("disabled");
      }, 3000); // Simple 3 second delay

      // searchInput.value = ""; // clear search disabled
    });
  }
}
