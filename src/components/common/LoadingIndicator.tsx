interface LoadingIndicatorProps {
  darkMode: boolean;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ darkMode }) => {
  return (
    <div className="w-full py-8">
      <div className="max-w-2xl mx-auto">
        <div className="animate-pulse space-y-8">
          {/* Loading header */}
          <div className={`h-8 rounded-lg w-1/3 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-200'}`}></div>
          
          {/* Loading grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <div className={`h-48 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-200'}`}></div>
                <div className={`h-4 rounded w-3/4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-200'}`}></div>
                <div className={`h-4 rounded w-1/2 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-200'}`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};