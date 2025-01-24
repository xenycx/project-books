import { BookOpen, Moon, Search, Sun } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onDarkModeToggle: () => void;
  onBackClick?: () => void;
  showSearch?: boolean;
}

export const Header = ({
  darkMode,
  searchQuery,
  onSearchChange,
  onDarkModeToggle,
  onBackClick,
  showSearch = true
}: HeaderProps) => {
  return (
    <header className={`fixed top-0 w-full z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6" />
            <h1 className="text-xl font-bold">Biblusi Books</h1>
          </div>
          
          {showSearch && (
            <div className="relative flex-1 mx-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search books and authors..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                    : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          )}

          <div className="flex items-center gap-4">
            {onBackClick && (
              <button
                onClick={onBackClick}
                className={`px-4 py-2 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Back to All Books
              </button>
            )}
            <button
              onClick={onDarkModeToggle}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};