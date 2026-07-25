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

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 ${
          isOpen ? 'bg-brand-mist text-brand-ink scale-90 opacity-0 pointer-events-none' : 'bg-brand-rose text-white'
        }`}
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 w-[calc(100vw-32px)] sm:w-[400px] h-[550px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-brand-border flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-brand-ink text-white px-5 py-4 flex items-center justify-between shadow-sm z-10 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-rose/20 flex items-center justify-center border border-brand-rose/30">
              <Sparkles className="w-5 h-5 text-brand-rose-light" />
            </div>
            <div>
              <h3 className="font-serif font-semibold text-lg leading-tight">Ranique Assistant</h3>
              <p className="text-xs text-brand-mist/70 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Online
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 bg-brand-mist/30 space-y-4">
          {messages.map((message: Message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] gap-2 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                  message.role === 'user' ? 'bg-brand-ink text-white' : 'bg-brand-rose text-white'
                }`}>
                  {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                {/* Message Bubble */}
                <div
                  className={`px-4 py-3 rounded-2xl text-sm font-sans ${
                    message.role === 'user'
                      ? 'bg-brand-ink text-white rounded-tr-sm'
                      : 'bg-white text-brand-ink shadow-sm border border-brand-border rounded-tl-sm'
                  }`}
                >
                  {/* Handle tool invocations visually */}
                  {message.toolInvocations && message.toolInvocations.length > 0 && (
                    <div className="mb-2 text-xs italic text-brand-slate flex items-center gap-1.5 bg-brand-mist px-2 py-1 rounded">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Searching products...
                    </div>
                  )}

                  <div className={`prose prose-sm max-w-none ${message.role === 'user' ? 'prose-invert text-white' : 'text-brand-ink'}`}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ node, ...props }) => (
                          <Link 
                            href={props.href || "#"} 
                            className="font-semibold text-brand-rose hover:text-brand-rose-dark underline decoration-brand-rose/30 underline-offset-2 transition-colors"
                            {...props}
                          />
                        ),
                        p: ({ node, ...props }) => <p className="m-0 mb-2 last:mb-0 leading-relaxed" {...props} />,
                        ul: ({ node, ...props }) => <ul className="m-0 ml-4 list-disc mb-2" {...props} />,
                        li: ({ node, ...props }) => <li className="m-0 mb-1" {...props} />,
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
              <div className="flex max-w-[85%] gap-2 flex-row">
                <div className="w-8 h-8 rounded-full bg-brand-rose text-white flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white text-brand-ink shadow-sm border border-brand-border rounded-tl-sm">
                  <div className="flex gap-1.5 items-center h-5">
                    <span className="w-1.5 h-1.5 bg-brand-rose/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-brand-rose/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-brand-rose/60 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-px w-full" />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-brand-border relative z-10">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 bg-brand-mist rounded-full p-1.5 border border-transparent focus-within:border-brand-rose/30 focus-within:bg-white transition-all shadow-sm"
          >
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent px-4 py-2 text-sm text-brand-ink placeholder:text-brand-slate focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 rounded-full bg-brand-rose text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 hover:bg-brand-rose-dark"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-brand-slate font-medium uppercase tracking-widest">
              Powered by AI • Ranique
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
