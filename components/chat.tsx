'use client'

import React, { useState, useEffect } from 'react';
import { useChat } from 'ai/react';
import { Plus, Settings2, ArrowUp, Sparkles, ChevronDown, Copy, Check } from 'lucide-react';
import MarkdownRenderer from './markdown-renderer';

const models = [
  { id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet' },
  { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
  { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' },
];

interface Model {
  id: string;
  name: string;
}

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

        <p className="text-center text-xs text-muted-foreground mt-3">
          Claude can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}