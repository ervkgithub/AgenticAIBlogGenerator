import './global.css';

export const metadata = {
  title: 'Agentic AI Blog Generator',
  description: 'Generate high quality LinkedIn blogs using Agentic AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
