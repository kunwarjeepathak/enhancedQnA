import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import Mermaid from './Mermaid';

interface MarkdownRendererProps {
  content: string;
  // allow passing plugins for code highlighting if you need them:
  remarkPlugins?: any[];
  rehypePlugins?: any[];
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  remarkPlugins = [remarkGfm],
  rehypePlugins = [[rehypeHighlight, { ignoreMissing: true }]],
}) => (
  <ReactMarkdown
    children={content}
    remarkPlugins={remarkPlugins}
    rehypePlugins={rehypePlugins}
    components={{
      code({ inline, className, children, ...props }) {
        const isMermaid = /language-mermaid/.test(className || '');
        if (!inline && isMermaid) {
          return <Mermaid chart={String(children).trim()} />;
        }
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
    }}
  />
);

export default MarkdownRenderer;