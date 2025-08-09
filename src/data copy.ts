// Types
export interface Bookmark {
  title: string;
  url: string;
  category: string;
  icon: string;
  description: string;
}

export type Category = "all" | "dev" | "social" | "tools" | "entertainment";

// Sample bookmark data
export const sampleBookmarks: Bookmark[] = [
  // Development
  {
    title: "GitHub",
    url: "https://github.com",
    category: "dev",
    icon: "🐙",
    description: "Code repositories and collaboration",
  },
  {
    title: "Stack Overflow",
    url: "https://stackoverflow.com",
    category: "dev",
    icon: "📚",
    description: "Programming Q&A community",
  },
  {
    title: "VS Code",
    url: "https://code.visualstudio.com",
    category: "dev",
    icon: "💻",
    description: "Code editor redefined",
  },
  {
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    category: "dev",
    icon: "📖",
    description: "Web development documentation",
  },

  // Social
  {
    title: "Twitter",
    url: "https://twitter.com",
    category: "social",
    icon: "🐦",
    description: "Social media platform",
  },
  {
    title: "Reddit",
    url: "https://reddit.com",
    category: "social",
    icon: "🤖",
    description: "Front page of the internet",
  },
  {
    title: "Discord",
    url: "https://discord.com",
    category: "social",
    icon: "💬",
    description: "Chat for communities",
  },

  // Tools
  {
    title: "Figma",
    url: "https://figma.com",
    category: "tools",
    icon: "🎨",
    description: "Collaborative design tool",
  },
  {
    title: "Notion",
    url: "https://notion.so",
    category: "tools",
    icon: "📝",
    description: "All-in-one workspace",
  },
  {
    title: "Tailwind CSS",
    url: "https://tailwindcss.com",
    category: "tools",
    icon: "🎭",
    description: "Utility-first CSS framework",
  },

  // Entertainment
  {
    title: "YouTube",
    url: "https://youtube.com",
    category: "entertainment",
    icon: "📺",
    description: "Video sharing platform",
  },
  {
    title: "Spotify",
    url: "https://spotify.com",
    category: "entertainment",
    icon: "🎵",
    description: "Music streaming service",
  },
  {
    title: "Netflix",
    url: "https://netflix.com",
    category: "entertainment",
    icon: "🎬",
    description: "Streaming entertainment",
  },
];

// Category colors mapping
export const categoryColors: Record<string, string> = {
  dev: "10",
  social: "11",
  tools: "13",
  entertainment: "15",
};
