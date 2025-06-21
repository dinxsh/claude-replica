'use client'

import React, { useState, useEffect } from 'react';
import { useChat } from 'ai/react';
import { Plus, Settings2, ArrowUp, Sparkles, ChevronDown, Copy, Check } from 'lucide-react';

const models = [
  { id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet' },
  { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
  { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' },
];

interface Model {
  id: string;
  name: string;
}

// Markdown renderer component
const MarkdownRenderer = ({ content }: { content: string }) => {
  const [copiedCode, setCopiedCode] = useState<number | null>(null);

  const copyCodeToClipboard = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(index);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const parseMarkdown = (text: string) => {
    const elements: React.JSX.Element[] = [];
    const lines = text.split('\n');
    let i = 0;
    let codeBlockIndex = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Code blocks
      if (line.startsWith('```')) {
        const language = line.slice(3).trim() || 'text';
        const codeLines: string[] = [];
        i++;
        
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        
        const code = codeLines.join('\n');
        const currentIndex = codeBlockIndex++;
        
        elements.push(
          <div key={`code-${currentIndex}`} className="relative my-4 bg-gray-900 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-300 text-sm">
              <span className="font-mono">{language}</span>
              <button
                onClick={() => copyCodeToClipboard(code, currentIndex)}
                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-700 transition-colors"
              >
                {copiedCode === currentIndex ? (
                  <>
                    <Check size={14} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto">
              <code className="text-gray-100 font-mono text-sm leading-relaxed">
                {code}
              </code>
            </pre>
          </div>
        );
        i++;
        continue;
      }

      // Inline code
      if (line.includes('`')) {
        const parts = line.split('`');
        const lineElements: (string | React.JSX.Element)[] = [];
        
        for (let j = 0; j < parts.length; j++) {
          if (j % 2 === 0) {
            lineElements.push(formatInlineText(parts[j], `${i}-${j}`));
          } else {
            lineElements.push(
              <code key={`inline-${i}-${j}`} className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded font-mono text-sm">
                {parts[j]}
              </code>
            );
          }
        }
        
        elements.push(<p key={`line-${i}`} className="mb-2">{lineElements}</p>);
      }
      // Headers
      else if (line.startsWith('# ')) {
        elements.push(<h1 key={`h1-${i}`} className="text-2xl font-bold mb-4 mt-6">{line.slice(2)}</h1>);
      }
      else if (line.startsWith('## ')) {
        elements.push(<h2 key={`h2-${i}`} className="text-xl font-bold mb-3 mt-5">{line.slice(3)}</h2>);
      }
      else if (line.startsWith('### ')) {
        elements.push(<h3 key={`h3-${i}`} className="text-lg font-bold mb-2 mt-4">{line.slice(4)}</h3>);
      }
      // Lists
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        const listItems = [line];
        i++;
        while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
          listItems.push(lines[i]);
          i++;
        }
        i--; // Step back one since we'll increment at the end of the loop
        
        elements.push(
          <ul key={`ul-${i}`} className="list-disc pl-6 mb-4 space-y-1">
            {listItems.map((item, idx) => (
              <li key={`li-${i}-${idx}`}>{formatInlineText(item.slice(2), `${i}-${idx}`)}</li>
            ))}
          </ul>
        );
      }
      // Numbered lists
      else if (/^\d+\.\s/.test(line)) {
        const listItems = [line];
        i++;
        while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
          listItems.push(lines[i]);
          i++;
        }
        i--; // Step back one
        
        elements.push(
          <ol key={`ol-${i}`} className="list-decimal pl-6 mb-4 space-y-1">
            {listItems.map((item, idx) => (
              <li key={`li-${i}-${idx}`}>{formatInlineText(item.replace(/^\d+\.\s/, ''), `${i}-${idx}`)}</li>
            ))}
          </ol>
        );
      }
      // Block quotes
      else if (line.startsWith('> ')) {
        const quoteLines = [line];
        i++;
        while (i < lines.length && lines[i].startsWith('> ')) {
          quoteLines.push(lines[i]);
          i++;
        }
        i--; // Step back one
        
        const quoteText = quoteLines.map(l => l.slice(2)).join('\n');
        elements.push(
          <blockquote key={`quote-${i}`} className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600 dark:text-gray-400">
            {formatInlineText(quoteText, `quote-${i}`)}
          </blockquote>
        );
      }
      // Empty lines
      else if (line.trim() === '') {
        elements.push(<div key={`br-${i}`} className="h-2"></div>);
      }
      // Regular paragraphs
      else {
        elements.push(<p key={`p-${i}`} className="mb-2">{formatInlineText(line, `p-${i}`)}</p>);
      }
      
      i++;
    }

    return elements;
  };

  const formatInlineText = (text: string, key: string): React.JSX.Element => {
    if (!text) return <span key={key}>{text}</span>;
    
    // Bold text
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formattedText = formattedText.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Italic text
    formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    formattedText = formattedText.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Links
    formattedText = formattedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>');
    
    return <span key={key} dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  return <div className="prose prose-sm max-w-none">{parseMarkdown(content)}</div>;
};

export default function Chat() {
  const [selectedModel, setSelectedModel] = useState<Model>(models[0]);
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [copied, setCopied] = useState('');

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    body: {
      model: selectedModel.id,
    },
  });

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(text);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };
  
  const handleModelSelect = (model: Model) => {
    setSelectedModel(model);
    setIsModelSelectorOpen(false);
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && !isLoading ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="flex justify-center items-center mb-4">
                <Sparkles className="text-primary w-10 h-10 mr-2" />
                <h1 className="text-4xl font-serif text-foreground/80">Coffee and Claude time?</h1>
              </div>
            </div>
          </div>
        ) : (
          messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`relative max-w-4xl p-4 rounded-lg ${m.role === 'user' ? 'bg-primary/10' : 'bg-muted'}`}>
                <p className="font-semibold capitalize mb-3">{m.role === 'assistant' ? 'Claude' : 'You'}</p>
                <div className="prose-content">
                  {m.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    <MarkdownRenderer content={m.content} />
                  )}
                </div>
                {m.role === 'assistant' && (
                  <button 
                    onClick={() => handleCopyToClipboard(m.content)}
                    className="absolute top-2 right-2 p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors opacity-70 hover:opacity-100"
                    title="Copy message"
                  >
                    {copied === m.content ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && <div className="flex justify-center items-center"><p>Thinking...</p></div>}
        {error && <div className="text-red-500 text-center">Error: {error.message}</div>}
      </div>

      {/* Input Area */}
      <div className="w-full px-4 pb-4 max-w-3xl mx-auto">
        <form onSubmit={handleFormSubmit}>
          <div className="relative border border-border rounded-xl p-2 flex items-center bg-background">
            <div className="flex items-center space-x-1 pl-1">
              <button type="button" className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted">
                <Plus size={20} />
              </button>
              <button type="button" className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted">
                <Settings2 size={20} />
              </button>
            </div>
            <textarea
              className="w-full resize-none border-0 focus:ring-0 px-3 py-3 text-base bg-transparent focus:outline-none"
              placeholder="Message Claude..."
              rows={1}
              style={{ minHeight: '52px' }}
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if(!isLoading) {
                        const form = (e.target as HTMLTextAreaElement).closest('form');
                        if (form) {
                          form.requestSubmit();
                        }
                      }
                  }
              }}
            />
            <div className="flex items-center space-x-2 pr-1">
              <div className="relative">
                <button type="button" onClick={() => setIsModelSelectorOpen(!isModelSelectorOpen)} className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                  <span>{selectedModel.name}</span>
                  <ChevronDown size={16} className="ml-1" />
                </button>
                {isModelSelectorOpen && (
                  <div className="absolute bottom-full mb-2 w-48 bg-card border border-border rounded-lg shadow-lg">
                    {models.map(model => (
                      <button key={model.id} onClick={() => handleModelSelect(model)} className="block w-full text-left px-4 py-2 text-sm hover:bg-muted">
                        {model.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" disabled={isLoading || !input.trim()} className="bg-primary/80 text-primary-foreground p-2 rounded-lg hover:bg-primary disabled:bg-muted disabled:text-muted-foreground">
                <ArrowUp size={20} />
              </button>
            </div>
          </div>
        </form>

        <div className="flex flex-wrap gap-2 justify-center mt-4">
            {/* Suggestion buttons can be wired up to set the input value */}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-3">
          Claude can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}