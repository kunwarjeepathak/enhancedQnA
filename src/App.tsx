import React, { useState } from 'react';
import Header   from './components/Header';
import Sidebar  from './components/Sidebar';
import QAList   from './components/QAList';
import { AskAI } from './AskAI';
import './ask-ai.css';

export type Category = 'all' | 'dsa'| 'java' | 'python' | 'systemDesign' | 'distributedArchitecture' | 'springBoot' | 'microservices' | 'cloud' | 'devOps' |'kafka' | 'aws' | 'azure' | 'dataArchitect' | 'aiEngineering' | 'agenticAiMcp' |'javascript' |'react' | 'angular'| 'database' | 'python' | 'golang' | 'leadership'| 'communication' | 'JPMCQuestions' | 'hobbies' | 'engineeringManager' | 'healthcare';

const categories = [
  { key: 'all' as Category,        label: 'All' },
  { key: 'dsa' as Category,        label: 'Data Structures Cheatsheet' },
  { key: 'springBoot' as Category, label: 'Spring' },
  { key: 'microservices' as Category, label: 'Microservices' },
  { key: 'golang' as Category,    label: 'Golang' },
  { key: 'healthcare' as Category,    label: 'Healthcare' },
  { key: 'distributedArchitecture' as Category,    label: 'Distributed Architecture' }
];

const architectureCategories = [
  { key: 'java' as Category, label: 'JAVA Architect' },
  { key: 'systemDesign' as Category, label: 'System Design Architect' },
  { key: 'cloud' as Category, label: 'Cloud Architect' },
  { key: 'devOps' as Category, label: 'DevOps Architect' },
  { key: 'dataArchitect' as Category, label: 'Data Architect' },
  { key: 'database' as Category, label: 'DB Architect' },
  { key: 'kafka' as Category, label: 'Kafka' },
  { key: 'aws' as Category, label: 'AWS' },
  { key: 'azure' as Category, label: 'Azure' }
];

const userInterfaceCategories = [
  { key: 'angular' as Category, label: 'Angular' },
  { key: 'react' as Category, label: 'React' },
  { key: 'javascript' as Category, label: 'Javascript and TypeScript' }
];

const artificialIntelligenceCategories = [
  { key: 'python' as Category, label: 'Python' },
  { key: 'aiEngineering' as Category, label: 'AI Engineering' },
  { key: 'agenticAiMcp' as Category, label: 'Agentic-AI and MCP' }
];

const peopleManagementCategories = [
  { key: 'leadership' as Category, label: 'Leadership' },
  { key: 'communication' as Category, label: 'Communication' },
  { key: 'engineeringManager' as Category, label: 'Engineering Manager' }
];

const otherCategories = [
  { key: 'JPMCQuestions' as Category, label: 'JPMC questions' },
  { key: 'hobbies' as Category, label: 'Hobbies' }
];

function App() {
  const [activeCat, setActiveCat] = useState<Category>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  React.useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  return (
    <>
      <Header
        onSearch={setSearchTerm}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((dm) => !dm)}
      />

      <div className="layout">
        <Sidebar
          categories={categories}
          architectureCategories={architectureCategories}
          userInterfaceCategories={userInterfaceCategories}
          artificialIntelligenceCategories={artificialIntelligenceCategories}
          peopleManagementCategories={peopleManagementCategories}
          otherCategories={otherCategories}
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
