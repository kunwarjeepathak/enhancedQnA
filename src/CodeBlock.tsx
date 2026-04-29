import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Props {
  language: string;
  value: string;
}

export function CodeBlock({ language, value }: Props) {
  return (
    <SyntaxHighlighter
      language={language}
      style={vs2015}
      showLineNumbers
    >
      {value}
    </SyntaxHighlighter>
  );
}