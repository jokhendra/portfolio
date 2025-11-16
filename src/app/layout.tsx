import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: "Jokhendra Prajapati - Portfolio",
  description: "Personal portfolio website showcasing my projects, skills, and experience.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'Jokhendra Prajapati - Portfolio',
    description: 'Personal portfolio website showcasing my projects, skills, and experience.',
    url: siteUrl,
    siteName: 'Jokhendra Portfolio',
    images: [
      { url: '/next.svg', width: 1200, height: 630, alt: 'Jokhendra Portfolio' },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jokhendra Prajapati - Portfolio',
    description: 'Personal portfolio website showcasing my projects, skills, and experience.',
    images: ['/next.svg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300`}>
        {children}
      </body>
    </html>
  );
} 