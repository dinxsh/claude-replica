'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
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
    <div className="relative my-6 rounded-xl bg-[#1e1e1e] border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-[#2d2d2d] border-b border-border">
        <span className="text-xs font-medium text-muted-foreground font-mono">{match[1]}</span>
        <button onClick={handleCopy} className="flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors duration-200">
          {copied ? <Check size={14} className="mr-1 text-green-500" /> : <Copy size={14} className="mr-1" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: '1rem',
          backgroundColor: 'transparent',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          fontFamily: 'JetBrains Mono, Consolas, Monaco, Andale Mono, monospace',
        }}
        {...props}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className="px-1.5 py-0.5 bg-muted rounded-md font-mono text-sm text-foreground" {...props}>
      {children}
    </code>
  );
};

const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <div className="prose prose-sm max-w-none text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock,
          p: ({...props}) => <p className="mb-4 leading-relaxed text-foreground" style={{ fontSize: '0.9375rem', lineHeight: '1.6' }} {...props} />,
          h1: ({...props}) => <h1 className="text-2xl font-semibold mb-4 mt-6 text-foreground" {...props} />,
          h2: ({...props}) => <h2 className="text-xl font-semibold mb-3 mt-5 text-foreground" {...props} />,
          h3: ({...props}) => <h3 className="text-lg font-semibold mb-2 mt-4 text-foreground" {...props} />,
          ul: ({...props}) => <ul className="list-disc pl-6 mb-4 space-y-1 text-foreground" {...props} />,
          ol: ({...props}) => <ol className="list-decimal pl-6 mb-4 space-y-1 text-foreground" {...props} />,
          blockquote: ({...props}) => <blockquote className="border-l-4 border-muted pl-4 italic my-4 text-muted-foreground" {...props} />,
          a: ({...props}) => <a className="text-primary hover:text-primary/80 underline decoration-primary/30 hover:decoration-primary/60 transition-colors" {...props} />,
          strong: ({...props}) => <strong className="font-semibold text-foreground" {...props} />,
          em: ({...props}) => <em className="italic text-foreground" {...props} />,
          table: ({...props}) => <table className="w-full border-collapse border border-border my-4" {...props} />,
          th: ({...props}) => <th className="bg-muted px-3 py-2 text-left font-medium text-foreground border border-border" {...props} />,
          td: ({...props}) => <td className="px-3 py-2 border border-border text-foreground" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer; 