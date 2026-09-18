'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Bot,
  Sparkles,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import { useTranslation } from '../../lib/i18n';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

function FormattedMessage({ content, isUser }: { content: string; isUser: boolean }) {
  const lines = content.split('\n');

  const formatInline = (text: string) => {
    // Matches **bold**, *italic*, and `code`
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        const inner = part.slice(2, -2);
        return (
          <strong
            key={index}
            className={`font-semibold ${isUser ? 'text-white' : 'text-slate-900'}`}
          >
            {inner}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
        const inner = part.slice(1, -1);
        return (
          <em key={index} className="italic">
            {inner}
          </em>
        );
      }
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        const inner = part.slice(1, -1);
        return (
          <code
            key={index}
            className={`px-1 py-0.5 rounded text-[11px] font-mono ${
              isUser ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-800'
            }`}
          >
            {inner}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-1.5 leading-relaxed">
      {lines.map((line, lIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lIdx} className="h-1" />;
        }

        // Continuous raw string without spaces (e.g. hash, token, encrypted payload)
        if (trimmed.length > 40 && !trimmed.includes(' ')) {
          return (
            <p key={lIdx} className="break-all font-mono text-[11px] select-all tracking-tight">
              {line}
            </p>
          );
        }

        // Bullet point lines (- item or * item or • item)
        if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
          const bulletText = trimmed.replace(/^[-•*]\s+/, '');
          return (
            <div key={lIdx} className="flex items-start gap-1.5 pl-1">
              <span className={`text-[12px] font-bold mt-0.5 shrink-0 ${isUser ? 'text-blue-200' : 'text-blue-600'}`}>
                •
              </span>
              <span className="flex-1">{formatInline(bulletText)}</span>
            </div>
          );
        }

        // Numbered list items (1. item, 2. item)
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numberedMatch) {
          const num = numberedMatch[1];
          const itemText = numberedMatch[2];
          return (
            <div key={lIdx} className="flex items-start gap-1.5 pl-1">
              <span className={`text-[11px] font-semibold mt-0.5 shrink-0 ${isUser ? 'text-blue-200' : 'text-blue-600'}`}>
                {num}.
              </span>
              <span className="flex-1">{formatInline(itemText)}</span>
            </div>
          );
        }

        return <p key={lIdx}>{formatInline(line)}</p>;
      })}
    </div>
  );
}

export default function ErasmusChatWidget() {
  const { t, locale } = useTranslation();
  const cb = t.chatbot;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Initialize welcome message or keep initial greeting updated when locale changes
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 0) {
        return [
          {
            id: 'welcome-1',
            role: 'assistant',
            content: cb.welcomeMsg,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ];
      }
      // If the chat currently only contains the welcome greeting or has welcome-1, keep it updated to match the active language
      if (prev.length > 0 && prev[0].id === 'welcome-1') {
        return [
          {
            ...prev[0],
            content: cb.welcomeMsg,
          },
          ...prev.slice(1),
        ];
      }
      if (prev.length > 0 && prev[0].id === 'reset-1') {
        return [
          {
            ...prev[0],
            content: cb.resetMsg,
          },
          ...prev.slice(1),
        ];
      }
      return prev;
    });
  }, [cb.welcomeMsg, cb.resetMsg]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const quickQuestions = [
    cb.quick1,
    cb.quick2,
    cb.quick3,
    cb.quick4,
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const apiMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, locale }),
      });

      if (!res.ok) {
        throw new Error('Yanıt alınamadı');
      }

      const data = await res.json();
      const reply = data.reply || (locale === 'en' ? 'Unable to generate response right now. Please try again shortly.' : 'Şu anda yanıt üretilemiyor. Lütfen biraz sonra tekrar deneyin.');

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: cb.errorMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'reset-1',
        role: 'assistant',
        content: cb.resetMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // If user explicitly dismissed the floating bubble completely
  if (isDismissed) {
    return (
      <button
        onClick={() => setIsDismissed(false)}
        className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white hover:bg-slate-800 text-xs px-3 py-1.5 rounded-full shadow-lg border border-slate-700 flex items-center gap-1.5 transition-all opacity-80 hover:opacity-100 cursor-pointer"
        title={cb.reopenTooltip}
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>{cb.reopenBtn}</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end print:hidden">
      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="mb-3 w-[92vw] sm:w-[400px] h-[540px] max-h-[82vh] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* HEADER */}
          <div className="bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-800 select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-400/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-semibold tracking-tight text-white">{cb.title}</h3>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    {cb.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-none mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {cb.status}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title={cb.resetTooltip}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title={cb.closeTooltip}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MESSAGES BODY */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-br-xs font-medium'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                    }`}
                  >
                    <FormattedMessage content={msg.content} isUser={isUser} />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs w-fit shadow-xs">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                </div>
                <span>{cb.thinking}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* QUICK PROMPTS */}
          {messages.length <= 2 && (
            <div className="p-2.5 bg-white border-t border-slate-100 flex flex-wrap gap-1.5">
              <span className="w-full text-[10px] font-medium text-slate-400 px-1">
                {cb.suggestedLabel}
              </span>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="text-left text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{q}</span>
                  <ArrowRight className="w-2.5 h-2.5 opacity-60 shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* INPUT AREA */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={cb.inputPlaceholder}
                className="flex-1 bg-slate-100 text-slate-800 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all placeholder:text-slate-400"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-blue-700 hover:bg-blue-800 disabled:opacity-40 disabled:hover:bg-blue-700 text-white p-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center cursor-pointer shrink-0"
                title={cb.sendTooltip}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>{cb.version}</span>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:text-slate-600 underline cursor-pointer"
              >
                {cb.closeLink}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING TRIGGER BUTTON & DISMISS CONTROLS */}
      {!isOpen && (
        <div className="relative group flex items-center">
          {/* Subtle close X to dismiss the bubble completely if user wants it off-screen */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsDismissed(true);
            }}
            className="absolute -top-2 -left-2 z-10 w-5 h-5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md border border-slate-700 cursor-pointer"
            title={cb.triggerDismissTooltip}
          >
            <X className="w-3 h-3" />
          </button>

          {/* Main Floating Trigger Button */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl border border-slate-700/80 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            aria-label={`${cb.title} ${cb.badge}`}
          >
            <div className="relative flex items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-pulse" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold tracking-tight text-white flex items-center gap-1">
                {cb.title}
                <Sparkles className="w-3 h-3 text-amber-400" />
              </span>
              <span className="text-[10px] text-slate-300">{cb.triggerSubtitle}</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
