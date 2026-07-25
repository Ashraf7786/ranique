"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { Message } from 'ai';
import { MessageCircle, X, Send, User, Bot, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome-message',
        role: 'assistant',
        content: 'Hi there! 👋 I am the Ranique Shopping Assistant. How can I help you find the perfect product today?',
      },
    ],
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center shadow-[0_10px_40px_-10px_rgba(201,116,138,0.6)] transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 ${
          isOpen ? 'bg-brand-mist text-brand-ink scale-90 opacity-0 pointer-events-none' : 'bg-gradient-to-br from-brand-rose to-[#A94F65] text-white hover:shadow-[0_10px_40px_-10px_rgba(201,116,138,0.9)]'
        }`}
        aria-label="Open chat"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-rose opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-rose border-2 border-white"></span>
        </span>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 w-[calc(100vw-32px)] sm:w-[420px] h-[600px] max-h-[85vh] bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)] border border-white/40 flex flex-col overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        {/* Header - Premium Gradient */}
        <div className="bg-gradient-to-r from-brand-ink via-[#2a2a4a] to-brand-ink text-white px-6 py-5 flex items-center justify-between shadow-md z-10 relative overflow-hidden">
          {/* Decorative shine in header */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-rose to-brand-rose-dark flex items-center justify-center shadow-inner border-2 border-white/10">
              <Sparkles className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl tracking-wide leading-tight text-white/95">Ranique AI</h3>
              <p className="text-xs text-brand-mist/80 flex items-center gap-1.5 font-medium mt-0.5 uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Assistant Online
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-white/20 active:bg-white/10 transition-colors relative z-10"
            aria-label="Close chat"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 bg-[#FAFAFA]/50 space-y-6">
          {messages.map((message: Message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[88%] gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-br from-brand-slate to-brand-ink text-white' 
                    : 'bg-gradient-to-br from-brand-rose to-[#A94F65] text-white'
                }`}>
                  {message.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                
                {/* Message Bubble */}
                <div
                  className={`px-5 py-3.5 rounded-2xl text-[15px] font-sans shadow-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-brand-ink to-[#2a2a4a] text-white rounded-tr-sm'
                      : 'bg-white text-brand-ink border border-brand-border/60 rounded-tl-sm shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]'
                  }`}
                >
                  {/* Handle tool invocations visually */}
                  {message.toolInvocations && message.toolInvocations.length > 0 && (
                    <div className="mb-3 text-xs font-medium text-brand-rose-dark flex items-center gap-2 bg-brand-rose/10 px-3 py-2 rounded-lg border border-brand-rose/20">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Searching collection...
                    </div>
                  )}

                  <div className={`prose prose-sm max-w-none ${message.role === 'user' ? 'prose-invert text-white/95' : 'text-brand-ink'}`}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ node, ...props }) => (
                          <Link 
                            href={props.href || "#"} 
                            className="font-semibold text-brand-rose hover:text-brand-rose-dark underline decoration-brand-rose/40 hover:decoration-brand-rose underline-offset-4 transition-colors"
                            {...props}
                          />
                        ),
                        p: ({ node, ...props }) => <p className="m-0 mb-3 last:mb-0" {...props} />,
                        ul: ({ node, ...props }) => <ul className="m-0 ml-5 list-disc mb-3 space-y-1" {...props} />,
                        li: ({ node, ...props }) => <li className="m-0" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-semibold text-inherit" {...props} />
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex justify-start">
              <div className="flex max-w-[85%] gap-3 flex-row">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-rose to-[#A94F65] text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="px-5 py-4 rounded-2xl bg-white text-brand-ink border border-brand-border/60 rounded-tl-sm shadow-sm flex items-center">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-brand-rose/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-brand-rose/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-brand-rose/60 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4 w-full" />
        </div>

        {/* Input Area */}
        <div className="p-5 bg-white border-t border-brand-border/50 relative z-10 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.02)]">
          <form
            onSubmit={handleFormSubmit}
            className="flex items-center gap-2 bg-[#F5F5F5] rounded-full p-1.5 border border-transparent focus-within:border-brand-rose/40 focus-within:bg-white focus-within:shadow-[0_0_15px_-3px_rgba(201,116,138,0.15)] transition-all duration-300"
          >
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about a product..."
              className="flex-1 bg-transparent px-4 py-2.5 text-[15px] text-brand-ink placeholder:text-brand-slate/80 focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-rose to-brand-rose-dark text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 hover:shadow-md"
              aria-label="Send message"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </form>
          <div className="text-center mt-3 flex items-center justify-center gap-1.5 opacity-60">
            <Sparkles className="w-3 h-3 text-brand-slate" />
            <span className="text-[10px] text-brand-slate font-bold uppercase tracking-widest">
              Powered by Ranique AI
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
