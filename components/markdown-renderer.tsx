'use client';

import React from 'react';
import ReactMarkdown, { Options } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const CodeBlock: React.ComponentType<CodeBlockProps> = ({ inline, className, children, ...props }) => {
  const [copied, setCopied] = React.useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const code = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return !inline && match ? (
    <div className="relative my-4 rounded-lg bg-[#2d2d2d]">
      <div className="flex items-center justify-between px-4 py-1 bg-gray-700 rounded-t-lg">
        <span className="text-xs text-gray-300">{match[1]}</span>
        <button onClick={handleCopy} className="flex items-center text-xs text-gray-300 hover:text-white">
          {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className="px-1 py-0.5 bg-muted rounded-sm font-mono text-sm" {...props}>
      {children}
    </code>
  );
};

const MarkdownRenderer = ({ content }: { content: string }) => {
  const components: Options['components'] = {
    code: CodeBlock,
    p: ({...props}) => <p className="mb-2" {...props} />,
    h1: ({...props}) => <h1 className="text-2xl font-bold mb-4 mt-6" {...props} />,
    h2: ({...props}) => <h2 className="text-xl font-bold mb-3 mt-5" {...props} />,
    h3: ({...props}) => <h3 className="text-lg font-bold mb-2 mt-4" {...props} />,
    ul: ({...props}) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
    ol: ({...props}) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
    blockquote: ({...props}) => <blockquote className="border-l-4 border-muted pl-4 italic my-4" {...props} />,
  };
  
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer; 