import React, { useState } from 'react';
import { Bot, Send, Sparkles, BookOpen, Code, HelpCircle, FileText } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Avatar, Badge } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';

export default function AITutorPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello Alex! I am your StudyVerse AI Tutor powered by GPT-4o. How can I help you master your subjects today?' }
  ]);

  const prompts = [
    { label: 'Explain Quantum Superposition', icon: BookOpen },
    { label: 'Write a Python Backpropagation script', icon: Code },
    { label: 'Generate a 5-question Quiz on Organic Chemistry', icon: HelpCircle },
    { label: 'Summarize USMLE Pharmacology Notes', icon: FileText }
  ];

  const handleSend = (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const newMsgs = [...messages, { role: 'user', text }];
    setMessages(newMsgs);
    if (!textToSend) setInput('');

    setTimeout(() => {
      setMessages([...newMsgs, {
        role: 'assistant',
        text: `Here is a detailed explanation for: "${text}"\n\n1. Core Principle: Breakdown of fundamental concepts with mathematical precision.\n2. Key Equation / Implementation: Detailed step-by-step framework.\n3. Summary: Practical applications for exams and projects.`
      }]);
    }, 1000);
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto p-4 sm:p-6 pb-24 md:pb-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-purple-50 text-[#8B5CF6] border border-purple-100 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#1E293B]">StudyVerse AI Tutor</h1>
              <p className="text-xs text-[#94A3B8]">Powered by GPT-4o · 24/7 Academic Assistant</p>
            </div>
          </div>
          <Badge variant="accent">Pro Unlocked</Badge>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-purple-50 text-[#8B5CF6] flex items-center justify-center shrink-0 border border-purple-100">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className={`max-w-xl p-4 rounded-[18px] text-sm leading-relaxed ${m.role === 'user' ? 'bg-[#4F7DF6] text-white rounded-br-none' : 'bg-white text-[#1E293B] border border-[#E2E8F0] card-shadow rounded-bl-none'}`}>
                {m.text.split('\n').map((line, idx) => <p key={idx}>{line}</p>)}
              </div>
            </div>
          ))}
        </div>

        {/* Suggested Prompts */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
          {prompts.map((p, i) => {
            const Icon = p.icon;
            return (
              <button
                key={i}
                onClick={() => handleSend(p.label)}
                className="px-3 py-1.5 rounded-full bg-white text-xs font-semibold text-[#64748B] border border-[#E2E8F0] hover:border-[#8B5CF6] hover:text-[#8B5CF6] whitespace-nowrap flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Icon className="w-3.5 h-3.5" /> {p.label}
              </button>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="pt-3 flex gap-2">
          <input
            type="text"
            placeholder="Ask AI Tutor anything (e.g. solve calculus problem, write notes...)"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-white border border-[#E2E8F0] rounded-[16px] px-4 py-3 text-sm focus:outline-none focus:border-[#8B5CF6] card-shadow"
          />
          <Button variant="accent" icon={Send} onClick={() => handleSend()}>Send</Button>
        </div>
      </div>
    </AppLayout>
  );
}
