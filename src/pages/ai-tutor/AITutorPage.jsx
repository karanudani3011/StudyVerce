import React, { useState, useRef, useEffect } from 'react';
import {
  Bot, Send, Sparkles, BookOpen, Code, HelpCircle,
  FileText, Loader2, AlertCircle, RotateCcw, User,
  Lightbulb, GraduationCap, Users, Trophy
} from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Badge } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';
import { apiPost, apiGet, apiDelete } from '../../config/api';
import { useAuth } from '../../context/AuthContext';

// ─── Suggested Prompts ────────────────────────────────────────────────────────
const SUGGESTED_PROMPTS = [
  { label: 'Explain Newton\'s Laws of Motion', icon: BookOpen },
  { label: 'Generate a 5-question quiz on Organic Chemistry', icon: HelpCircle },
  { label: 'Write a Python Backpropagation script for my CS class', icon: Code },
  { label: 'Summarize USMLE Pharmacology notes', icon: FileText },
  { label: 'How do I earn XP on StudyVerse?', icon: Trophy },
  { label: 'Study tips for university exams', icon: Lightbulb },
  { label: 'How to join a StudyVerse community?', icon: Users },
  { label: 'Explain the Krebs Cycle step by step', icon: GraduationCap },
];

// ─── Typing Indicator ─────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="flex gap-3 justify-start">
    <div className="w-8 h-8 rounded-full bg-purple-50 text-[#8B5CF6] flex items-center justify-center shrink-0 border border-purple-100">
      <Bot className="w-4 h-4" />
    </div>
    <div className="px-4 py-3 rounded-[18px] rounded-bl-none bg-white border border-[#E2E8F0] shadow-sm flex items-center gap-1.5">
      <span className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  </div>
);

// ─── Message Bubble ───────────────────────────────────────────────────────────
const MessageBubble = ({ message, userName, userAvatar }) => {
  const isUser = message.role === 'user';
  const isError = message.isError;

  const formatText = (text) => {
    // Split by newlines and render each line, bold **text**
    return text.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className={i > 0 ? 'mt-1' : ''}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
        </p>
      );
    });
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${isError ? 'bg-red-50 text-red-500 border-red-100' : 'bg-purple-50 text-[#8B5CF6] border-purple-100'}`}>
          {isError ? <AlertCircle className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>
      )}

      <div className={`max-w-xl px-4 py-3 rounded-[18px] text-sm leading-relaxed ${
        isUser
          ? 'bg-[#4F7DF6] text-white rounded-br-none'
          : isError
          ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-none'
          : 'bg-white text-[#1E293B] border border-[#E2E8F0] shadow-sm rounded-bl-none'
      }`}>
        {formatText(message.text)}
        <p className={`text-[10px] mt-2 ${isUser ? 'text-white/60 text-right' : 'text-[#94A3B8]'}`}>
          {message.time}
        </p>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-[#EEF4FF] border border-[#E2E8F0] flex items-center justify-center shrink-0 overflow-hidden">
          {userAvatar
            ? <img src={userAvatar} alt="you" className="w-full h-full object-cover" />
            : <User className="w-4 h-4 text-[#4F7DF6]" />
          }
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AITutorPage() {
  const { user } = useAuth();

  const getTime = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hello${user?.name ? ` ${user.name.split(' ')[0]}` : ''}! 👋 I'm your **StudyVerse AI Tutor** — powered by Google Gemini.\n\nI can help you with:\n📚 Academic subjects (Math, Physics, CS, Chemistry, Biology & more)\n🎓 Explaining concepts, solving problems & generating quizzes\n✨ StudyVerse platform features & study tips\n\n**Note:** I'm scoped to StudyVerse topics only — ask me anything study-related!`,
      time: getTime(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Load chat history from MongoDB once user is loaded
  useEffect(() => {
    const fetchHistory = async () => {
      if (user?.id || user?._id) {
        try {
          const data = await apiGet('/ai/history');
          if (data.success && data.messages && data.messages.length > 0) {
            setMessages(data.messages);
          }
        } catch (e) {
          console.error("Error loading chat history:", e);
        }
      }
    };
    fetchHistory();
  }, [user]);

  // Auto-scroll to bottom on new message or loading state change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ─── Send Message ───────────────────────────────────────────────────────────
  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || isTyping) return;

    setInput('');
    setError('');

    const userMessage = { role: 'user', text, time: getTime() };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const data = await apiPost('/ai/chat', {
        userMessage: text,
        time: getTime(),
      });

      if (data.success) {
        const botMessage = {
          role: 'assistant',
          text: data.reply,
          time: data.time || getTime(),
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (err) {
      const errMsg = err.message || 'Something went wrong. Please try again.';
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: errMsg,
        time: getTime(),
        isError: true,
      }]);
      setError(errMsg);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleClearChat = async () => {
    try {
      const clearedMessages = [{
        role: 'assistant',
        text: `Chat cleared! 🧹 I'm still here — ask me anything study-related, ${user?.name?.split(' ')[0] || 'friend'}!`,
        time: getTime(),
      }];
      setMessages(clearedMessages);
      setError('');
      setInput('');
      
      // Delete from DB
      await apiDelete('/ai/history');
    } catch (e) {
      console.error("Error clearing chat history:", e);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto px-4 sm:px-6 pb-24 md:pb-6">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between py-4 border-b border-[#E2E8F0] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-purple-50 text-[#8B5CF6] border border-purple-100 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#1E293B]">StudyVerse AI Tutor</h1>
              <p className="text-xs text-[#94A3B8] flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                Powered by Gemini · StudyVerse topics only
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              title="Clear chat"
              className="p-2 rounded-[10px] text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B] transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <Badge variant="accent">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Active
            </Badge>
          </div>
        </div>

        {/* ── Scope Notice ────────────────────────────────────────────────── */}
        {/*
        <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-[10px] bg-amber-50 border border-amber-200 text-amber-800 text-xs shrink-0">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>This AI only answers <strong>academic & StudyVerse questions</strong>. Off-topic questions will be declined.</span>
        </div>
        */}

        {/* ── Messages ────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {messages.map((m, i) => (
            <MessageBubble
              key={i}
              message={m}
              userName={user?.name}
              userAvatar={user?.avatar}
            />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* ── Suggested Prompts ────────────────────────────────────────────── */}
        {messages.length <= 1 && !isTyping && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 shrink-0">
            {SUGGESTED_PROMPTS.slice(0, 5).map((p, i) => {
              const Icon = p.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleSend(p.label)}
                  className="px-3 py-1.5 rounded-full bg-white text-xs font-semibold text-[#64748B] border border-[#E2E8F0] hover:border-[#8B5CF6] hover:text-[#8B5CF6] whitespace-nowrap flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                >
                  <Icon className="w-3.5 h-3.5" /> {p.label}
                </button>
              );
            })}
          </div>
        )}

        {/* ── Input Bar ───────────────────────────────────────────────────── */}
        <div className="pt-3 flex gap-2 shrink-0">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask about a subject, concept, quiz, or StudyVerse feature..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            disabled={isTyping}
            className="flex-1 bg-white border border-[#E2E8F0] rounded-[16px] px-4 py-3 text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/10 shadow-sm disabled:opacity-50 transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={isTyping || !input.trim()}
            className="flex items-center gap-2 px-4 py-3 rounded-[16px] bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {isTyping
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Send className="w-4 h-4" />
            }
            <span className="hidden sm:inline">{isTyping ? 'Thinking...' : 'Send'}</span>
          </button>
        </div>

      </div>
    </AppLayout>
  );
}
