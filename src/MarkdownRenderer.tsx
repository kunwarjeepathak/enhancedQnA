// src/MarkdownRenderer.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { CodeBlock } from './CodeBlock';

interface Props { content: string; }

export const MarkdownRenderer: React.FC<Props> = ({ content }) => (
  <ReactMarkdown
    components={{
      code({ node, inline, className, children }) {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
          <CodeBlock language={match[1]} value={String(children).trim()} />
        ) : (
          <code className={className}>{children}</code>
        );
      }
    }}
  >
    {content}
  </ReactMarkdown>
);