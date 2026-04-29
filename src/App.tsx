import React, { useState } from 'react';
import Header   from './components/Header';
import Sidebar  from './components/Sidebar';
import QAList   from './components/QAList';
import { AskAI } from './AskAI';

export type Category = 'all' | 'dsa'| 'java' | 'systemDesign' | 'springBoot' | 'microservices' | 'cloud' | 'devOps' |'kafka' | 'aws' | 'azure' | 'dataArchitect' | 'aiEngineering' |'javascript' |'react' | 'angular'| 'database' | 'python' | 'golang' | 'leadership'| 'communication' | 'JPMCQuestions' | 'hobbies' | 'engineeringManager' | 'Healthcare';

const categories = [
  { key: 'all' as Category,        label: 'All' },
  { key: 'dsa' as Category,        label: 'Data Structures Cheatsheet' },
  { key: 'java' as Category,       label: 'JAVA Architect' },
  { key: 'systemDesign' as Category,       label: 'System Design Architect' },
  { key: 'springBoot' as Category, label: 'Spring' },
  { key: 'microservices' as Category, label: 'Microservices' },
  { key: 'cloud' as Category,      label: 'Cloud Architect' },
  { key: 'devOps' as Category,      label: 'DevOps Architect' },
  { key: 'kafka' as Category,      label: 'Kafka' },
  { key: 'aws' as Category,      label: 'AWS' },
  { key: 'azure' as Category,      label: 'Azure' },
  { key: 'dataArchitect' as Category,      label: 'Data Architect' },
  { key: 'aiEngineering' as Category,      label: 'AI Engineering' },
  { key: 'javascript' as Category,      label: 'Javascript and TypeScript' },
  { key: 'react' as Category,      label: 'React' },
  { key: 'angular' as Category,    label: 'Angular' },
  { key: 'database' as Category,    label: 'DB Architect' },
  { key: 'python' as Category,    label: 'Python' },
  { key: 'golang' as Category,    label: 'Golang' },
  { key: 'leadership' as Category,    label: 'Leadership' },
  { key: 'communication' as Category,    label: 'Communication' },
  { key: 'JPMQuestions' as Category,    label: 'JPMC questions' },
  { key: 'hobbies' as Category,    label: 'Hobbies' },
  { key: 'engineeringManager' as Category,    label: 'Engineering Manager' },
  { key: 'Healthcare' as Category,    label: 'Healthcare' }
];

function App() {
  const [activeCat, setActiveCat] = useState<Category>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  React.useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  return (
    <>
      <Header onSearch={setSearchTerm} />

      <button
        className="dark-mode-toggle"
        onClick={() => setDarkMode((dm) => !dm)}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      <div className="layout">
        <Sidebar
          categories={categories}
          active={activeCat}
          onSelect={setActiveCat}
        />
        <QAList category={activeCat} searchTerm={searchTerm} />
      </div>

      {/* AI Assistant — always mounted, context-aware */}
      <AskAI activeCategory={activeCat} darkMode={darkMode} />
    </>
  );
}

export default App;
