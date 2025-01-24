import { ReactNode } from 'react';
import { Search, Moon, Sun, ArrowLeft } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  darkMode: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onDarkModeToggle: () => void;
  onBackClick?: () => void;
  showSearch: boolean;
}

export const Layout = ({
  children,
  darkMode,
  searchQuery,
  onSearchChange,
  onDarkModeToggle,
  onBackClick,
  showSearch
}: LayoutProps) => {
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBackClick && (
                <button
                  onClick={onBackClick}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              )}
              <h1 className="text-2xl font-bold">Books Store</h1>
            </div>
            <div className="flex items-center gap-4">
              {showSearch && (
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search books or authors..."
                    className={`w-64 px-4 py-2 rounded-lg ${
                      darkMode
                        ? 'bg-gray-700 text-white placeholder-gray-400'
                        : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
              )}
              <button
                onClick={onDarkModeToggle}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {darkMode ? (
                  <Sun className="w-6 h-6" />
                ) : (
                  <Moon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};