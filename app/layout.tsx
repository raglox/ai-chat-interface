
import React from 'react';
import { SettingsProvider } from '../context/SettingsContext.tsx';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gemini AI Chat',
  description: 'A sophisticated, scalable, and robust AI chat interface inspired by modern SaaS designs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <style>{`
          body {
            font-family: 'Inter', sans-serif;
          }
          /* Custom scrollbar for webkit browsers */
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #a0a0a0;
            border-radius: 20px;
            border: 3px solid transparent;
          }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #4a4a4a;
          }
        `}</style>
        <script>
          {`
            tailwind.config = {
              darkMode: 'class',
              theme: {
                extend: {
                  colors: {
                    'light-bg': '#F9FAFB',
                    'dark-bg': '#111111',
                    'light-sidebar': '#FFFFFF',
                    'dark-sidebar': '#1C1C1C',
                    'light-border': '#E5E7EB',
                    'dark-border': '#2D2D2D',
                    'light-text': '#1F2937',
                    'dark-text': '#F3F4F6',
                    'light-text-secondary': '#6B7280',
                    'dark-text-secondary': '#9CA3AF',
                    'accent': '#6366F1',
                    'accent-hover': '#4F46E5',
                  },
                },
              },
            };
          `}
        </script>
      </head>
      <body className="bg-light-bg dark:bg-dark-bg">
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
