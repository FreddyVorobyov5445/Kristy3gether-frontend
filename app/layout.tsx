import { ColorSchemeScript } from '@mantine/core';
import '@mantine/core/styles.css';
import type { Metadata } from 'next';
import App from './app';
import './globals.css';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Watch2gether',
  description:
    'Watch2gether offers a unique platform for real-time video sharing, enabling you to watch videos with your friends from anywhere. Synchronize your screens and immerse yourselves in a shared viewing experience.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className="flex flex-col items-center justify-center gap-4 p-4 md:p-8 bg-gradient-to-br from-purple-900 to-red-800">
        <App>{children}</App>
        <Footer />
      </body>
    </html>
  );
}
