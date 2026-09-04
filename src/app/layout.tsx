import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/profile";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const title = `${profile.name} - ${profile.role}`;
const description = `${profile.role} building ${profile.brandLine}. Production RAG pipelines and LangGraph agents with real tool boundaries, on top of FastAPI, Express and NestJS services, WebSocket realtime layers and AWS delivery.`;

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s - ${profile.name}`,
  },
  description,
  metadataBase: new URL(siteUrl),
  applicationName: `${profile.name} - Portfolio`,
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  keywords: [
    "Senior AI Engineer",
    "AI Full-Stack Engineer",
    "AI Engineer",
    "Generative AI Engineer",
    "Agentic AI",
    "LangChain",
    "LangGraph",
    "MCP",
    "Model Context Protocol",
    "RAG",
    "Retrieval Augmented Generation",
    "LLM applications",
    "Full-stack engineer",
    "Backend engineer",
    "Python developer",
    "FastAPI",
    "Django",
    "Node.js",
    "Express",
    "NestJS",
    "WebSockets",
    "Socket.IO",
    "MediaSoup",
    "Realtime systems",
    "Microservices",
    "AWS",
    "Docker",
    "Next.js",
    "PostgreSQL",
    "MongoDB",
    profile.name,
  ],
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: `${profile.name} - ${profile.role}`,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: '/icon', type: 'image/png' }],
    apple: [{ url: '/apple-icon', type: 'image/png' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Applies the stored theme before paint so the first frame is not the
          wrong colour scheme.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
