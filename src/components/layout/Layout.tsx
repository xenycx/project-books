import React from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onDarkModeToggle: () => void;
  onBackClick?: () => void;
  showSearch?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  darkMode,
  searchQuery,
  onSearchChange,
  onDarkModeToggle,
  onBackClick,
  showSearch
}) => {
  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Header
        darkMode={darkMode}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onDarkModeToggle={onDarkModeToggle}
        onBackClick={onBackClick}
        showSearch={showSearch}
        className="fixed top-0 left-0 right-0 z-50"
      />
      <main className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {children}
      </main>
    </div>
  );
};