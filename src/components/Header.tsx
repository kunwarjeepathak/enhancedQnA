import React, { useState } from 'react';

interface HeaderProps {
  onSearch: (term: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchValue('');
    onSearch('');
  };

  return (
    <header>
      <div className="logo">📚 Tech Understanding Stories</div>
      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input
          type="search"
          placeholder="Search questions, topics, or concepts..."
          aria-label="Search questions"
          value={searchValue}
          onChange={e => handleSearch(e.target.value)}
        />
        <button
          className={`search-clear ${searchValue ? 'visible' : ''}`}
          onClick={clearSearch}
          aria-label="Clear search"
        >
          ✕
        </button>
      </div>
    </header>
  );
}