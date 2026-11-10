
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
  architectureCategories: CategoryItem[];
  userInterfaceCategories: CategoryItem[];
  artificialIntelligenceCategories: CategoryItem[];
  peopleManagementCategories: CategoryItem[];
  otherCategories: CategoryItem[];
  active: Category;
  onSelect: (cat: Category) => void;
}

// Category icons mapping (Material Icons)
const categoryIcons: Record<Category, JSX.Element> = {
  all: <ListAlt fontSize="small" />,
  dsa: <ListAlt fontSize="small" />,
  java: <Coffee fontSize="small" />,
  systemDesign: <Build fontSize="small" />,
  distributedArchitecture: <Build fontSize="small" />,
  springBoot: <Nature fontSize="small" />,
  microservices: <Nature fontSize="small" />,
  aiEngineering: <Nature fontSize="small" />,
  agenticAiMcp: <Science fontSize="small" />,
  cloud: <Cloud fontSize="small" />,
  devOps: <BuildCircle fontSize="small" />,
  kafka: <Send fontSize="small" />,
  aws: <RocketLaunch fontSize="small" />,
  azure: <Public fontSize="small" />,
  dataArchitect: <SupervisorAccount fontSize="small" />,
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
  healthcare: <LocalHospital fontSize="small" />,
  hobbies: <Palette fontSize="small" />
};

export default function Sidebar({
  categories,
  architectureCategories,
  userInterfaceCategories,
  artificialIntelligenceCategories,
  peopleManagementCategories,
  otherCategories,
  active,
  onSelect
}: SidebarProps) {
  const [isArchitectureExpanded, setIsArchitectureExpanded] = React.useState(false);
  const [isUserInterfaceExpanded, setIsUserInterfaceExpanded] = React.useState(false);
  const [isArtificialIntelligenceExpanded, setIsArtificialIntelligenceExpanded] = React.useState(false);
  const [isPeopleManagementExpanded, setIsPeopleManagementExpanded] = React.useState(false);
  const [isOthersExpanded, setIsOthersExpanded] = React.useState(false);

  const renderCategory = (cat: CategoryItem) => (
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
  );

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
        {categories.slice(0, 2).map(renderCategory)}
        <li className="architecture-group">
          <button
            className="sidebar-item architecture-toggle"
            onClick={() => setIsArchitectureExpanded(expanded => !expanded)}
            aria-expanded={isArchitectureExpanded}
            aria-controls="architecture-categories"
          >
            <span className="category-icon"><Engineering fontSize="small" /></span>
            <span>Architecture</span>
            <span className="architecture-chevron" aria-hidden="true">
              {isArchitectureExpanded ? '−' : '+'}
            </span>
          </button>
          {isArchitectureExpanded && (
            <ul id="architecture-categories" className="architecture-subcategories">
              {architectureCategories.map(renderCategory)}
            </ul>
          )}
        </li>
        <li className="user-interface-group">
          <button
            className="sidebar-item architecture-toggle"
            onClick={() => setIsUserInterfaceExpanded(expanded => !expanded)}
            aria-expanded={isUserInterfaceExpanded}
            aria-controls="user-interface-categories"
          >
            <span className="category-icon"><Code fontSize="small" /></span>
            <span>User Interface</span>
            <span className="architecture-chevron" aria-hidden="true">
              {isUserInterfaceExpanded ? '−' : '+'}
            </span>
          </button>
          {isUserInterfaceExpanded && (
            <ul id="user-interface-categories" className="architecture-subcategories">
              {userInterfaceCategories.map(renderCategory)}
            </ul>
          )}
        </li>
        <li className="artificial-intelligence-group">
          <button
            className="sidebar-item architecture-toggle"
            onClick={() => setIsArtificialIntelligenceExpanded(expanded => !expanded)}
            aria-expanded={isArtificialIntelligenceExpanded}
            aria-controls="artificial-intelligence-categories"
          >
            <span className="category-icon"><Science fontSize="small" /></span>
            <span>Artificial Intelligence</span>
            <span className="architecture-chevron" aria-hidden="true">
              {isArtificialIntelligenceExpanded ? '−' : '+'}
            </span>
          </button>
          {isArtificialIntelligenceExpanded && (
            <ul id="artificial-intelligence-categories" className="architecture-subcategories">
              {artificialIntelligenceCategories.map(renderCategory)}
            </ul>
          )}
        </li>
        <li className="people-management-group">
          <button
            className="sidebar-item architecture-toggle"
            onClick={() => setIsPeopleManagementExpanded(expanded => !expanded)}
            aria-expanded={isPeopleManagementExpanded}
            aria-controls="people-management-categories"
          >
            <span className="category-icon"><Groups fontSize="small" /></span>
            <span>People management</span>
            <span className="architecture-chevron" aria-hidden="true">
              {isPeopleManagementExpanded ? '−' : '+'}
            </span>
          </button>
          {isPeopleManagementExpanded && (
            <ul id="people-management-categories" className="architecture-subcategories">
              {peopleManagementCategories.map(renderCategory)}
            </ul>
          )}
        </li>
        <li className="others-group">
          <button
            className="sidebar-item architecture-toggle"
            onClick={() => setIsOthersExpanded(expanded => !expanded)}
            aria-expanded={isOthersExpanded}
            aria-controls="other-categories"
          >
            <span className="category-icon"><ListAlt fontSize="small" /></span>
            <span>Others</span>
            <span className="architecture-chevron" aria-hidden="true">
              {isOthersExpanded ? '−' : '+'}
            </span>
          </button>
          {isOthersExpanded && (
            <ul id="other-categories" className="architecture-subcategories">
              {otherCategories.map(renderCategory)}
            </ul>
          )}
        </li>
        {categories.slice(2).map(renderCategory)}
      </ul>
    </aside>
  );
}
