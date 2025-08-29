https://emojipedia.org/en/search?q=google
https://www.fileformat.info/info/unicode/char/2696/index.htm?utm_source=chatgpt.com

# Bookmarks Configuration

## YAML Configuration

The bookmarks and categories are now stored in `bookmarks.yml` file located in the root directory. This file contains:

- **categories**: Array of all available bookmark categories
- **categoryColors**: Mapping of category names to color codes
- **bookmarks**: Array of bookmark objects with title, url, category, icon, and description

## Editing Bookmarks

To add, edit, or remove bookmarks:

1. Edit the `bookmarks.yml` file in the root directory
2. The changes will be automatically reflected in the application
3. Make sure to copy the updated file to `public/bookmarks.yml` for the development server
