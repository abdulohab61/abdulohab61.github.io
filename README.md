# 📂 OpenBookmarks - Modern Browser Dashboard

<div align="center">

![OpenBookmarks Logo](./src/assets/icon.png)

**A sleek, modern homepage for managing and navigating your favorite bookmarks**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Nord Theme](https://img.shields.io/badge/Nord-Theme-5E81AC?style=for-the-badge&logo=nordvpn&logoColor=white)](https://www.nordtheme.com/)

[Live Demo](#) • [Features](#features) • [Installation](#installation) • [Usage](#usage) • [Contributing](#contributing)

</div>

## ✨ Features

### 🔍 **Smart Search**

- **Multi-Engine Search**: Search across Google, DuckDuckGo, Brave, YouTube, Wikipedia, and more
- **URL Detection**: Automatically opens URLs when typed
- **Instant Search**: Search all engines simultaneously with `Ctrl+Enter`
- **Smart Suggestions**: Search through your bookmarks instantly

### ⌨️ **Keyboard Navigation**

- **Tab Navigation**: Use `Tab` to start navigating bookmarks
- **Arrow Keys**: Navigate up/down through bookmarks
- **Enter**: Open selected bookmark or search
- **Escape**: Clear search and return to home
- **Ctrl+Q**: Quick select first bookmark

### 📱 **Modern UI/UX**

- **Nord Color Palette**: Beautiful, consistent dark theme
- **Responsive Design**: Works perfectly on all devices
- **Smooth Animations**: Fade-in effects and hover transitions
- **Minimalist Design**: Clean, distraction-free interface

### 🏷️ **Category Management**

- **Dynamic Categories**: Auto-generated from YAML configuration
- **15+ Categories**: Development, AI, Social, Tools, Entertainment, Study, and more
- **Smart Filtering**: Filter bookmarks by category with one click
- **Color-Coded**: Each category has its unique Nord color

### 🔧 **Developer Features**

- **TypeScript**: Full type safety and modern ES6+ features
- **Modular Architecture**: Clean, maintainable code structure
- **YAML Configuration**: Easy bookmark management
- **Vite Build System**: Lightning-fast development and builds

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/AbdulOhab/open-bookmarks-homepage.git
cd open-bookmarks-homepage

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

## 🌐 Deployment

### GitHub Pages Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. Every push to the `main` branch triggers a new deployment.

**Live Site**: [https://abdulohab.github.io/open-bookmarks-homepage/](https://abdulohab.github.io/open-bookmarks-homepage/)

#### Manual Deployment Steps:

1. **Enable GitHub Pages**:

   - Go to your GitHub repository
   - Navigate to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`

2. **Push to main branch**:

   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **GitHub Actions will automatically**:
   - Install dependencies
   - Build the project
   - Deploy to GitHub Pages

#### Alternative: Manual Build & Deploy

```bash
# Build the project
npm run build

# Deploy to gh-pages branch (if using gh-pages package)
npm install -g gh-pages
gh-pages -d dist
```

## 📁 Project Structure

```
OpenBookmarks/
├── 📄 index.html              # Main HTML file
├── 📦 package.json            # Dependencies and scripts
├── ⚙️ vite.config.ts          # Vite configuration
├── 🎨 tailwind.config.ts      # Tailwind CSS configuration
├── 📘 tsconfig.json           # TypeScript configuration
├── 📂 src/
│   ├── 🎯 main.ts             # Application entry point
│   ├── 📚 bookmarks.ts        # Bookmark management
│   ├── 🔍 search.ts           # Search engine logic
│   ├── ⌨️ handleKeyboard.ts   # Keyboard navigation
│   ├── 📊 data-loader.ts      # YAML data loading
│   ├── 🛠️ utils.ts            # Utility functions
│   ├── 🎨 css/style.css       # Custom styles
│   └── 📂 assets/
│       └── 🖼️ icon.png        # App icon
└── 📂 public/
    └── 📝 bookmarks.yml       # Bookmark configuration
```

## ⚙️ Configuration

### Adding Bookmarks

Edit `public/bookmarks.yml` to add your bookmarks:

```yaml
bookmarks:
  - title: "GitHub"
    url: "https://github.com"
    category: "dev"
    icon: "🐙"
    description: "Code repositories and collaboration"
```

### Adding Categories

Add new categories to the configuration:

```yaml
categories:
  - "your-category"

categoryColors:
  your-category: "12" # Nord color (0-15)
```

### Search Engines

Modify search engines in `src/search.ts`:

```typescript
export const searchEngines: SearchEngine[] = [
  {
    name: "Your Engine",
    url: "https://yourengine.com/search",
    parameter: "q",
  },
];
```

## 🎹 Keyboard Shortcuts

| Shortcut        | Action                           |
| --------------- | -------------------------------- |
| `Tab`           | Start bookmark navigation        |
| `↑` `↓`         | Navigate through bookmarks       |
| `Enter`         | Open selected bookmark or search |
| `Ctrl+Enter`    | Search in all engines            |
| `Ctrl+Q`        | Select first bookmark            |
| `Escape`        | Clear search and reset           |
| `F5` / `Ctrl+R` | Refresh data                     |

## 🎨 Theming

The project uses the **Nord color palette** for a consistent, beautiful appearance:

- **Polar Night**: Dark backgrounds and UI elements
- **Snow Storm**: Light text and content
- **Frost**: Accent colors for interactive elements
- **Aurora**: Category colors and highlights

## 🛠️ Tech Stack

- **Frontend**: TypeScript, HTML5, CSS3
- **Styling**: Tailwind CSS with Nord theme
- **Build Tool**: Vite
- **Data Format**: YAML
- **Architecture**: Modular ES6+ modules

## 📊 Features Overview

### Search Engines Supported

- 🔍 Google
- 🦆 DuckDuckGo
- 🦁 Brave Search
- 🏠 Startpage
- 🇫🇷 Qwant
- 📺 YouTube
- 🟡 Yandex
- 📖 Wikipedia

### Bookmark Categories

- 💻 Development (GitHub, VS Code, Stack Overflow)
- 🤖 AI Tools (ChatGPT, Bard, Perplexity)
- 📱 Social Media (Twitter, Reddit, Discord)
- 🛠️ Tools (Google Translate, Maps, PDF tools)
- 🎬 Entertainment (YouTube, Netflix, Spotify)
- 📚 Study (W3Schools, GeeksforGeeks, LeetCode)
- And many more...

## 🚀 Performance

- ⚡ **Lightning Fast**: Vite-powered build system
- 📦 **Lightweight**: Minimal dependencies
- 🎯 **Optimized**: Tree-shaking and code splitting
- 📱 **Responsive**: Mobile-first design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Nord Theme](https://www.nordtheme.com/) for the beautiful color palette
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vite](https://vitejs.dev/) for the blazing fast build tool
- [TypeScript](https://www.typescriptlang.org/) for type safety

## 📞 Support

If you have any questions or need help, please [open an issue](https://github.com/AbdulOhab/open-bookmarks-homepage/issues) on GitHub.

---

<div align="center">

**Made with ❤️ by [AbdulOhab](https://github.com/AbdulOhab)**

**Star ⭐ this repo if you find it helpful!**

</div>
