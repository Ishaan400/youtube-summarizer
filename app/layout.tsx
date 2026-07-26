import type { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'YouTube Summarizer',
  description: 'AI-powered YouTube video summarization',
  authors: [{ name: 'Ishaan' }],
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen">
        {children}
      </body>
    </html>
  );
}
