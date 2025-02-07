import { Author } from '../../types';

interface AuthorCardProps {
  author: Author;
  darkMode: boolean;
  onAuthorClick: (author: Author) => void;
}

export const AuthorCard: React.FC<AuthorCardProps> = ({ author, darkMode, onAuthorClick }) => {
  return (
    <div
      onClick={() => onAuthorClick(author)}
      className={`flex flex-col rounded-lg cursor-pointer transition-all duration-200 overflow-hidden ${
        darkMode 
          ? 'bg-gray-800 hover:bg-gray-700' 
          : 'bg-white hover:bg-gray-50'
      } shadow hover:shadow-lg`}
    >
      {author.img && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={author.img}
            alt={author.fullname}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {author.fullname}
        </h3>
        {author.country && (
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {author.country}
          </p>
        )}
        {author.description && (
          <p className={`mt-2 text-sm line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {author.description}
          </p>
        )}
        {(author.year_start || author.year_end) && (
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {author.year_start && author.year_end ? 
              `${author.year_start} - ${author.year_end}` : 
              author.year_start || author.year_end}
          </p>
        )}
      </div>
    </div>
  );
};