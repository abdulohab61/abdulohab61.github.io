# 🦆 Bookmarks Dashboard

A beautiful, modern bookmarks dashboard built with TypeScript, Tailwind CSS, and Vite. Features Nord color scheme and smooth animations.

## ✨ Features

- 🎨 **Beautiful Nordic Design** - Clean UI with Nord color palette
- 🔍 **Smart Search** - Search bookmarks by title, description, or URL
- 📂 **Category Filtering** - Organize bookmarks by development, social, tools, entertainment
- ⌨️ **Keyboard Navigation** - Full keyboard support with arrow keys, Tab, Enter, Escape
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🦆 **Goose Personality** - Fun easter eggs and animations
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## ⌨️ Keyboard Shortcuts

- `Arrow Keys` - Navigate through bookmarks
- `Tab` - Cycle through bookmarks
- `Enter` - Open selected bookmark or search Google
- `Escape` - Clear search and reset
- `Any key` - Focus search input

## 🎨 Nord Color Palette

The design uses the beautiful Nord color scheme:

- **Polar Night**: Dark backgrounds (#2e3440, #3b4252, #434c5e, #4c566a)
- **Snow Storm**: Light text (#d8dee9, #e5e9f0, #eceff4)
- **Frost**: Accent colors (#8fbcbb, #88c0d0, #81a1c1, #5e81ac)
- **Aurora**: Highlight colors (#bf616a, #d08770, #ebcb8b, #a3be8c, #b48ead)

## 🔧 Customization

### Adding New Bookmarks

Edit `src/data.ts` to add your own bookmarks:

```typescript
{
  title: 'Your Site',
  url: 'https://example.com',
  category: 'dev', // dev, social, tools, entertainment
  icon: '🌟',
  description: 'Your description here',
}
```

## 📦 Technologies Used

- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS v4** - Utility-first CSS framework
- **Vite** - Fast build tool
- **Nord** - Color palette
- **Fira Code** - Monospace font

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.
