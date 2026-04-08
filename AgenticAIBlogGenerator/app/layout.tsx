import type { Metadata } from 'next';
import './global.css';

export const metadata: Metadata = {
  title: 'Agentic AI Blog Generator',
  description: 'Generate technical blogs via n8n + LLM agents.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

