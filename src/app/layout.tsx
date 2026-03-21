import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Analytics } from "@vercel/analytics/next";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteConfig = {
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "Stop guessing which MCP servers to use. Browse community-curated stacks, copy configs in one click.",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "MCP Stacks — Discover & Share Curated MCP Server Combos",
    template: "%s — MCP Stacks",
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
        className={`${outfit.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
