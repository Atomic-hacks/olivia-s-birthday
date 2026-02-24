import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';

const headingFont = Cormorant_Garamond({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

const bodyFont = Manrope({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Olivia Birthday Celebration',
  description: 'A thoughtful birthday experience with memories, wishes, games, and celebrations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable} font-[var(--font-body)]`}>{children}</body>
    </html>
  );
}
