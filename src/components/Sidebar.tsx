
import React from 'react';
import { Category } from '../App';

interface CategoryItem { key: Category; label: string; }
interface SidebarProps {
  categories: CategoryItem[];
  active: Category;
  onSelect: (cat: Category) => void;
}

// Category icons mapping
const categoryIcons: Record<Category, string> = {
  all: '📋',
  java: '☕',
  systemDesign: '🏗️',
  springBoot: '🌱',
  cloud: '☁️',
  devOps: '🔧',
  kafka: '📨',
  aws: '🚀',
  azure: '🌐',
  javascript: '🟨',
  react: '⚛️',
  angular: '🔺',
  database: '🗄️',
  python: '🐍',
  golang: '🐹',
  engineeringManager: '🧑‍💼',
  leadership: '👥',
  communication: '💬',
  JPMCQuestions: '🏦',
  hobbies: '🎨'
  
};

export default function Sidebar({ categories, active, onSelect }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">Categories</div>
      </div>
      <ul>
        {categories.map(cat => (
          <li key={cat.key}>
            <button
              className={`sidebar-item ${active === cat.key ? 'active' : ''}`}
              onClick={() => onSelect(cat.key)}
              data-cat={cat.key}
              aria-pressed={active === cat.key}
            >
              <span className="category-icon">
                {categoryIcons[cat.key]}
              </span>
              <span>{cat.label}</span>
              {cat.key !== 'all' && (
                <span className="category-count">
                  {Math.floor(Math.random() * 15) + 1}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
