
import React from 'react';
import {
  ListAlt,
  Coffee,
  Engineering,
  Build,
  Nature,
  Cloud,
  BuildCircle,
  Send,
  RocketLaunch,
  Public,
  Javascript,
  Science,
  ChangeHistory,
  Storage,
  Code,
  SportsBaseball,
  SupervisorAccount,
  Groups,
  Chat,
  AccountBalance,
  Palette
  ,LocalHospital
} from '@mui/icons-material';
import { Category } from '../App';

interface CategoryItem { key: Category; label: string; }
interface SidebarProps {
  categories: CategoryItem[];
  active: Category;
  onSelect: (cat: Category) => void;
}

// Category icons mapping (Material Icons)
const categoryIcons: Record<Category, JSX.Element> = {
  all: <ListAlt fontSize="small" />,
  java: <Coffee fontSize="small" />,
  systemDesign: <Build fontSize="small" />,
  springBoot: <Nature fontSize="small" />,
  microservices: <Nature fontSize="small" />,
  cloud: <Cloud fontSize="small" />,
  devOps: <BuildCircle fontSize="small" />,
  kafka: <Send fontSize="small" />,
  aws: <RocketLaunch fontSize="small" />,
  azure: <Public fontSize="small" />,
  javascript: <Javascript fontSize="small" />,
  react: <Science fontSize="small" />,
  angular: <ChangeHistory fontSize="small" />,
  database: <Storage fontSize="small" />,
  python: <Code fontSize="small" />,
  golang: <SportsBaseball fontSize="small" />,
  engineeringManager: <Engineering fontSize="small" />,
  leadership: <Groups fontSize="small" />,
  communication: <Chat fontSize="small" />,
  JPMCQuestions: <AccountBalance fontSize="small" />,
  Healthcare: <LocalHospital fontSize="small" />,
  hobbies: <Palette fontSize="small" />
};

export default function Sidebar({ categories, active, onSelect }: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="Category navigation">
      <div className="sidebar-header">
        <div className="sidebar-title">Categories</div>
        <button
          className="high-contrast-toggle"
          aria-label="Toggle high contrast mode"
          onClick={() => {
            document.body.classList.toggle('high-contrast');
          }}
        >
          🌓 High Contrast
        </button>
      </div>
      <ul>
        {categories.map(cat => (
          <li key={cat.key}>
            <button
              className={`sidebar-item ${active === cat.key ? 'active' : ''}`}
              onClick={() => onSelect(cat.key)}
              data-cat={cat.key}
              aria-pressed={active === cat.key}
              aria-label={`Select category ${cat.label}`}
            >
              <span className="category-icon">
                {categoryIcons[cat.key]}
              </span>
              <span>{cat.label}</span>
              {cat.key !== 'all' && (
                <span className="category-count" aria-label="Number of items in category">
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
