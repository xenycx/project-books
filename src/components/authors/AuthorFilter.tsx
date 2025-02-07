import React from 'react';

interface AuthorFilterProps {
  showAuthorsOnly: boolean;
  onToggle: (showAuthors: boolean) => void;
}

const AuthorFilter: React.FC<AuthorFilterProps> = ({ showAuthorsOnly, onToggle }) => {
  return (
    <div className="author-filter">
      <button
        className={`filter-button ${showAuthorsOnly ? 'active' : ''}`}
        onClick={() => onToggle(!showAuthorsOnly)}
      >
        მხოლოდ ავტორები
      </button>
    </div>
  );
};

export default AuthorFilter;
