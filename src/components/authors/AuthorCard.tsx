import { Author } from '../../types';

interface AuthorCardProps {
  author: Author;
  darkMode: boolean;
  onClick: (author: Author) => void;
}

export const AuthorCard = ({ author, darkMode, onClick }: AuthorCardProps) => {
  return (
    <div
      onClick={() => onClick(author)}
      className={`${
        darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
      } rounded-lg shadow-lg overflow-hidden transition-transform duration-200 hover:-translate-y-1 cursor-pointer`}
    >
      {author.img && (
        <div className="aspect-square relative overflow-hidden">
          <img
            src={author.img}
            alt={author.fullname}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{author.fullname}</h3>
        {author.country && (
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {author.country}
          </p>
        )}
      </div>
    </div>
  );
};