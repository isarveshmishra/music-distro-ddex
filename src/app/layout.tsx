'use client';

import { useEffect } from 'react';
import { initializeApp } from '@/lib/init';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initializeApp();
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
