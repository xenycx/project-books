import { Author } from '../../types';
import { AuthorCard } from './AuthorCard';

interface AuthorListProps {
  authors: Author[];
  darkMode: boolean;
  onAuthorClick: (author: Author) => void;
}

export const AuthorList = ({ authors, darkMode, onAuthorClick }: AuthorListProps) => {
  if (authors.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Authors
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {authors.map((author) => (
          <AuthorCard
            key={author.id}
            author={author}
            darkMode={darkMode}
            onClick={onAuthorClick}
          />
        ))}
      </div>
    </div>
  );
};