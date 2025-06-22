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
    <div className="flex flex-col h-screen bg-background text-foreground font-sans">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {messages.length === 0 && !isLoading ? (
            <div className="welcome-screen">
              <div className="welcome-content">
                <div className="welcome-icon">
                  <Sparkles className="text-primary w-8 h-8" />
                </div>
                <h1 className="welcome-title">Coffee and Claude time?</h1>
                <p className="welcome-subtitle">I&apos;m here to help you think, create, and explore ideas.</p>
              </div>
            </div>
          ) : (
            messages.map((m: { id: string; role: string; content: string }) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`relative max-w-3xl group ${m.role === 'user' ? 'chat-message-user' : 'chat-message-assistant'} p-6`}>
                  <div className="flex items-start gap-3">
                    {m.role === 'assistant' && (
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Sparkles className="text-primary w-4 h-4" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-sm text-foreground">
                          {m.role === 'assistant' ? 'Claude' : 'You'}
                        </span>
                        {m.role === 'assistant' && (
                          <button 
                            onClick={() => handleCopyToClipboard(m.content)}
                            className="copy-button"
                            title="Copy message"
                          >
                            {copied === m.content ? (
                              <Check size={14} className="text-green-600" />
                            ) : (
                              <Copy size={14} className="text-muted-foreground" />
                            )}
                          </button>
                        )}
                      </div>
                      <div className="prose prose-sm max-w-none">
                        {m.role === 'user' ? (
                          <p className="text-foreground leading-relaxed whitespace-pre-wrap">{m.content}</p>
                        ) : (
                          <MarkdownRenderer content={m.content} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="chat-message-assistant p-6 max-w-3xl">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="text-primary w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-sm text-foreground">Claude</span>
                    </div>
                    <div className="claude-loading">
                      <div className="flex space-x-1">
                        <div className="claude-loading-dot"></div>
                        <div className="claude-loading-dot" style={{ animationDelay: '0.1s' }}></div>
                        <div className="claude-loading-dot" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-center">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 max-w-md">
                <p className="text-destructive text-sm text-center">Error: {error.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="chat-input-area">
        <div className="max-w-4xl mx-auto p-6">
          <form onSubmit={handleFormSubmit}>
            <div className="chat-input-container">
              <div className="flex items-center gap-1">
                <button type="button" className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors duration-200">
                  <Plus size={20} />
                </button>
                <button type="button" className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors duration-200">
                  <Settings2 size={20} />
                </button>
              </div>
              <div className="flex-1">
                <textarea
                  className="chat-textarea"
                  placeholder="Message Claude..."
                  rows={1}
                  style={{ minHeight: '24px', maxHeight: '200px' }}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (!isLoading && input.trim()) {
                        const form = (e.target as HTMLTextAreaElement).closest('form');
                        if (form) {
                          form.requestSubmit();
                        }
                      }
                    }
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button 
                    type="button" 
                    onClick={() => setIsModelSelectorOpen(!isModelSelectorOpen)} 
                    className="model-selector"
                  >
                    <span className="font-medium">{selectedModel.name}</span>
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                  {isModelSelectorOpen && (
                    <div className="model-dropdown">
                      {models.map(model => (
                        <button 
                          key={model.id} 
                          onClick={() => handleModelSelect(model)} 
                          className="model-option"
                        >
                          {model.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading || !input.trim()} 
                  className="chat-send-button"
                >
                  <ArrowUp size={20} />
                </button>
              </div>
            </div>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Claude can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
}