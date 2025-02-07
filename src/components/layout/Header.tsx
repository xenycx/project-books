import { BookOpen, Moon, Search, Sun } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onDarkModeToggle: () => void;
  onBackClick?: () => void;
  showSearch?: boolean;
  className?: string;
}

export const Header = ({
  darkMode,
  searchQuery,
  onSearchChange,
  onDarkModeToggle,
  onBackClick,
  showSearch = true,
  className = ''
}: HeaderProps) => {
  return (
    <header className={`${className} ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} shadow-md backdrop-blur-sm`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-2 flex-shrink-0">
            <BookOpen className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Biblusi Books
            </h1>
          </div>
          
          {showSearch && (
            <div className="relative flex-1 max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search books and authors..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-gray-700/50 text-white placeholder-gray-400 border-gray-600' 
                    : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-200'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
              />
            </div>
          )}
          
          <div className="flex items-center gap-4 flex-shrink-0">
            {onBackClick && (
              <button
                onClick={onBackClick}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  darkMode 
                    ? 'bg-gray-700/50 hover:bg-gray-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Back to All Books
              </button>
            )}
            <button
              onClick={onDarkModeToggle}
              className={`p-2 rounded-full transition-colors ${
                darkMode 
                  ? 'bg-gray-700/50 hover:bg-gray-600 text-yellow-400 hover:text-yellow-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
              }`}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};