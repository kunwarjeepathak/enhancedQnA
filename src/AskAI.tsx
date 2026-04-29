import React, { useState, useRef, useEffect } from 'react';
import { Category } from './App';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

interface Props {
  activeCategory: Category;
  darkMode: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  all: 'General',
  dsa: 'Data Structures & Algorithms',
  java: 'Java Architecture',
  systemDesign: 'System Design',
  springBoot: 'Spring Boot',
  microservices: 'Microservices',
  cloud: 'Cloud Architecture',
  devOps: 'DevOps',
  kafka: 'Apache Kafka',
  aws: 'AWS',
  azure: 'Azure',
  dataArchitect: 'Data Architecture',
  aiEngineering: 'AI Engineering',
  javascript: 'JavaScript & TypeScript',
  react: 'React',
  angular: 'Angular',
  database: 'Database Architecture',
  python: 'Python',
  golang: 'Golang',
  leadership: 'Leadership',
  communication: 'Communication',
  JPMCQuestions: 'JPMC Questions',
  hobbies: 'Hobbies',
  engineeringManager: 'Engineering Manager',
  Healthcare: 'Healthcare',
};

const SUGGESTED_PROMPTS = [
  'Explain this concept with an example',
  'What are the key differences?',
  'What are common interview questions?',
  'Give me a real-world use case',
  'What are best practices?',
];

export const AskAI: React.FC<Props> = ({ activeCategory, darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const categoryLabel = CATEGORY_LABELS[activeCategory] || activeCategory;

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
    };

    const assistantId = (Date.now() + 1).toString();
    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setInput('');
    setIsLoading(true);

    const systemPrompt = `You are a concise, expert technical assistant embedded in a Q&A study app. 
The user is currently viewing the "${categoryLabel}" category.
Give sharp, actionable answers with code examples when relevant.
Use markdown formatting — headings, bullet points, inline code, and code blocks with language tags.
Keep responses focused and practical. If asked about topics outside the current category, still help helpfully.`;

    // Gemini expects role "model" instead of "assistant"
    const conversationHistory = [...messages, userMsg].map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`;

    abortRef.current = new AbortController();

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: conversationHistory,
          generationConfig: { maxOutputTokens: 1024 },
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (!data || data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                accumulated += text;
                setMessages(prev =>
                  prev.map(m =>
                    m.id === assistantId
                      ? { ...m, content: accumulated, isStreaming: true }
                      : m
                  )
                );
              }
            } catch {}
          }
        }
      }

      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId ? { ...m, isStreaming: false } : m
        )
      );
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? { ...m, content: '⚠️ Something went wrong. Please try again.', isStreaming: false }
              : m
          )
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    abortRef.current?.abort();
    setMessages([]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="ask-ai-backdrop" onClick={() => setIsOpen(false)} />
      )}

      {/* Chat Panel */}
      <div className={`ask-ai-panel ${isOpen ? 'ask-ai-panel--open' : ''} ${darkMode ? 'dark-mode' : ''}`}>
        {/* Panel Header */}
        <div className="ask-ai-header">
          <div className="ask-ai-header-left">
            <div className="ask-ai-avatar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L13.09 8.26L19 7L14.74 11.74L21 12L14.74 12.26L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12.26L3 12L9.26 11.74L5 7L10.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <div className="ask-ai-title">Ask AI</div>
              <div className="ask-ai-context">
                {categoryLabel}
              </div>
            </div>
          </div>
          <div className="ask-ai-header-right">
            {messages.length > 0 && (
              <button
                className="ask-ai-clear-btn"
                onClick={clearChat}
                title="Clear chat"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                </svg>
              </button>
            )}
            <button
              className="ask-ai-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close AI panel"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="ask-ai-messages">
          {messages.length === 0 ? (
            <div className="ask-ai-empty">
              <div className="ask-ai-empty-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L13.09 8.26L19 7L14.74 11.74L21 12L14.74 12.26L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12.26L3 12L9.26 11.74L5 7L10.91 8.26L12 2Z" fill="#2563eb" opacity="0.7"/>
                </svg>
              </div>
              <p className="ask-ai-empty-title">Ask anything about <strong>{categoryLabel}</strong></p>
              <p className="ask-ai-empty-sub">Get instant explanations, examples & interview tips</p>
              <div className="ask-ai-suggestions">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    className="ask-ai-suggestion-chip"
                    onClick={() => sendMessage(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map(msg => (
              <div
                key={msg.id}
                className={`ask-ai-message ask-ai-message--${msg.role}`}
              >
                {msg.role === 'assistant' && (
                  <div className="ask-ai-msg-avatar">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L13.09 8.26L19 7L14.74 11.74L21 12L14.74 12.26L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12.26L3 12L9.26 11.74L5 7L10.91 8.26L12 2Z" fill="white"/>
                    </svg>
                  </div>
                )}
                <div className="ask-ai-bubble">
                  <RenderContent content={msg.content} />
                  {msg.isStreaming && (
                    <span className="ask-ai-cursor" aria-hidden="true" />
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="ask-ai-input-area">
          {messages.length > 0 && !isLoading && (
            <div className="ask-ai-quick-prompts">
              {['Explain more', 'Show example', 'Interview tip'].map((p, i) => (
                <button key={i} className="ask-ai-quick-chip" onClick={() => sendMessage(p)}>
                  {p}
                </button>
              ))}
            </div>
          )}
          <div className="ask-ai-input-row">
            <textarea
              ref={inputRef}
              className="ask-ai-input"
              placeholder={`Ask about ${categoryLabel}…`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isLoading}
            />
            <button
              className={`ask-ai-send-btn ${(!input.trim() || isLoading) ? 'ask-ai-send-btn--disabled' : ''}`}
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              {isLoading ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ask-ai-spin">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
          <div className="ask-ai-hint">⏎ to send · Shift+⏎ new line</div>
        </div>
      </div>

      {/* FAB Button */}
      {!isOpen && (
        <button
          className="ask-ai-fab"
          onClick={() => setIsOpen(true)}
          aria-label="Ask AI assistant"
        >
          <span className="ask-ai-fab-pulse" />
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.09 8.26L19 7L14.74 11.74L21 12L14.74 12.26L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12.26L3 12L9.26 11.74L5 7L10.91 8.26L12 2Z" fill="white"/>
          </svg>
          <span className="ask-ai-fab-label">Ask AI</span>
        </button>
      )}
    </>
  );
};

/* ── Simple inline markdown renderer ── */
const RenderContent: React.FC<{ content: string }> = ({ content }) => {
  if (!content) return <span className="ask-ai-thinking">Thinking…</span>;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={i} className="ask-ai-code-block">
          {lang && <span className="ask-ai-code-lang">{lang}</span>}
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
    } else if (/^#{1,3}\s/.test(line)) {
      const level = line.match(/^(#{1,3})/)?.[1].length ?? 1;
      const text = line.replace(/^#{1,3}\s/, '');
      const Tag = `h${level + 2}` as keyof JSX.IntrinsicElements;
      elements.push(<Tag key={i} className="ask-ai-heading">{parseInline(text)}</Tag>);
    } else if (/^[-*]\s/.test(line)) {
      elements.push(<li key={i} className="ask-ai-li">{parseInline(line.replace(/^[-*]\s/, ''))}</li>);
    } else if (line.trim() === '') {
      elements.push(<br key={i} />);
    } else {
      elements.push(<p key={i} className="ask-ai-p">{parseInline(line)}</p>);
    }
    i++;
  }

  return <>{elements}</>;
};

function parseInline(text: string): React.ReactNode[] {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="ask-ai-inline-code">{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}
