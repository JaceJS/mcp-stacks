import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteConfig = {
  name: "MCP Stacks",
  url: "https://mcpstacks.dev",
  description:
    "Discover and share curated MCP server combinations. Browse community-tested stacks, copy configs in one click, and share your own setup.",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "MCP Stacks — Discover & Share Curated MCP Server Combos",
    template: "%s | MCP Stacks",
  },
  description: siteConfig.description,
  keywords: [
    "MCP",
    "MCP servers",
    "Model Context Protocol",
    "AI tools",
    "developer tools",
    "Claude",
    "Cursor",
    "Windsurf",
    "VS Code",
    "MCP config",
    "AI development",
    "context7",
  ],
  authors: [{ name: "MCP Stacks", url: siteConfig.url }],
  creator: "MCP Stacks",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "MCP Stacks — Discover & Share Curated MCP Server Combos",
    description: siteConfig.description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MCP Stacks — Community-curated MCP server combinations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MCP Stacks — Discover & Share Curated MCP Server Combos",
    description: siteConfig.description,
    images: ["/og-image.png"],
    creator: "@mcpstacks",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
