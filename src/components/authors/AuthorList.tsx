import { Author } from '../../types';
import { AuthorCard } from './AuthorCard';

interface AuthorListProps {
  authors: Author[];
  darkMode: boolean;
  onAuthorClick: (author: Author) => void;
  loading?: boolean;
  loadingRef?: (node?: Element | null) => void;
}

export const AuthorList: React.FC<AuthorListProps> = ({ 
  authors, 
  darkMode, 
  onAuthorClick,
  loading,
  loadingRef
}) => {
  if (authors.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="space-y-4">
      {authors.length > 0 && (
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          ავტორები
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {authors.map((author) => (
          <AuthorCard
            key={author.id}
            author={author}
            darkMode={darkMode}
            onAuthorClick={onAuthorClick}
          />
        ))}
      </div>
      {loading && (
        <div 
          ref={loadingRef}
          className="flex justify-center p-4"
        >
          <div className={`inline-block h-8 w-8 animate-spin rounded-full border-4 ${
            darkMode ? 'border-white border-t-transparent' : 'border-gray-900 border-t-transparent'
          }`} />
        </div>
      )}
    </div>
  );
};