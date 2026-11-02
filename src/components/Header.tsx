import React, { useState } from 'react';

interface HeaderProps {
  onSearch: (term: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Header({ onSearch, darkMode, onToggleDarkMode }: HeaderProps) {
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
      <button
        className="dark-mode-toggle"
        onClick={onToggleDarkMode}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
    </header>
  );
}