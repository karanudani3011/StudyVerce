import React, { useState } from 'react';
import { Bot, Send, Sparkles, Paperclip, Mic, Plus, Copy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/layout/Sidebar';
import { TopHeader } from '../components/layout/TopHeader';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';

export const AITutorPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Hello! I\'m your 24/7 StudyVerse AI Tutor. Ask me anything — calculus formulas, code debugging, essay outlines, or practice quizzes.',
      timestamp: '10:00 AM'
    },
    {
      id: 'm2',
      sender: 'user',
      text: 'Can you explain Quantum Superposition with a math formula?',
      timestamp: '10:01 AM'
    },
    {
      id: 'm3',
      sender: 'ai',
      text: 'Of course! In quantum mechanics, superposition means a system exists in all possible states simultaneously until measured.\n\nThe quantum state |Ψ⟩ is represented as:',
      mathSnippet: '|Ψ⟩ = α|0⟩ + β|1⟩   where   |α|² + |β|² = 1',
      codeSnippet: `from qiskit import QuantumCircuit

qc = QuantumCircuit(1, 1)
qc.h(0)   # Hadamard gate → superposition
qc.measure(0, 0)
print(qc)`,
      timestamp: '10:01 AM'
    }
  ]);
  const [input, setInput] = useState('');

  const chatHistory = [
    { title: 'Quantum Superposition & Math', time: 'Today' },
    { title: 'Neural Network Backpropagation', time: 'Yesterday' },
    { title: 'UPSC Indian Polity Notes', time: '3 days ago' },
    { title: 'C++ Binary Tree Traversal', time: '1 week ago' },
  ];

  const chips = [
    'Explain Calculus Chain Rule',
    'Generate 5 Python quiz questions',
    'Summarize Quantum Physics notes'
  ];

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), sender: 'user', text: input, timestamp: ts },
      { id: (Date.now() + 1).toString(), sender: 'ai', text: `Great question about "${input}"! Here's a structured breakdown...`, timestamp: ts }
    ]);
    setInput('');
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#1E293B]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopHeader />

        <div className="flex-1 flex overflow-hidden">
          {/* Chat History Panel */}
          <aside className="w-64 hidden lg:flex flex-col border-r border-[#E2E8F0] bg-white p-4 gap-4 justify-between">
            <div className="space-y-4">
              <Button variant="primary" fullWidth icon={Plus} size="sm">New AI Chat</Button>
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-2">Recent Chats</h4>
                <div className="space-y-0.5">
                  {chatHistory.map((chat, idx) => (
                    <button key={idx} className="w-full text-left p-2.5 rounded-[12px] text-xs font-medium text-[#64748B] hover:bg-[#F5F7FB] hover:text-[#1E293B] truncate transition-colors">
                      💬 {chat.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-3.5 rounded-[16px] bg-purple-50 border border-purple-200/60 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-[#8B5CF6]">
                <span>GPT-4o Model Active</span>
                <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
              </div>
              <p className="text-[11px] text-purple-500">Unlimited queries on StudyVerse Pro</p>
            </div>
          </aside>

          {/* Main Chat Canvas */}
          <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full p-4 sm:p-6 overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-5 pr-1">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'ai' && (
                    <div className="w-9 h-9 rounded-[14px] bg-purple-50 border border-purple-200/60 text-[#8B5CF6] flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5" strokeWidth={2} />
                    </div>
                  )}

                  <div className={`max-w-[80%] space-y-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className={`p-4 rounded-[20px] text-sm leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-[#4F7DF6] text-white rounded-tr-[6px]'
                        : 'bg-white border border-[#E2E8F0] text-[#1E293B] shadow-[0_2px_8px_rgba(15,23,42,0.04)] rounded-tl-[6px]'
                    }`}>
                      {msg.text}

                      {msg.mathSnippet && (
                        <div className="mt-3 p-3 rounded-[12px] bg-[#EEF4FF] border border-[#E2E8F0] text-xs font-mono text-[#4F7DF6]">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1">LaTeX Expression</span>
                          {msg.mathSnippet}
                        </div>
                      )}

                      {msg.codeSnippet && (
                        <div className="mt-3 rounded-[12px] bg-[#1E293B] text-slate-100 p-4 font-mono text-xs overflow-x-auto border border-slate-800">
                          <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-700/60 text-[10px] text-slate-400">
                            <span>Python (Qiskit)</span>
                            <button className="hover:text-white flex items-center gap-1 transition-colors">
                              <Copy className="w-3.5 h-3.5" strokeWidth={2} /> Copy
                            </button>
                          </div>
                          <pre>{msg.codeSnippet}</pre>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-[#94A3B8] px-1">{msg.timestamp}</span>
                  </div>

                  {msg.sender === 'user' && (
                    <Avatar src={user.avatar} alt={user.name} size="sm" />
                  )}
                </div>
              ))}
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
              {chips.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => setInput(chip)}
                  className="px-3 py-1.5 rounded-[12px] text-xs font-medium bg-white border border-[#E2E8F0] hover:border-[#4F7DF6] text-[#64748B] hover:text-[#4F7DF6] whitespace-nowrap transition-colors shrink-0"
                >
                  ✨ {chip}
                </button>
              ))}
            </div>

            {/* Input Field */}
            <form onSubmit={handleSend} className="relative">
              <input
                type="text"
                placeholder="Ask anything — formulas, code, essay outlines, quiz generation..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-[16px] pl-4 pr-28 py-3.5 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#4F7DF6] focus:ring-2 focus:ring-[#4F7DF6]/20 transition-all shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button type="button" className="p-2 text-[#94A3B8] hover:text-[#64748B] rounded-[10px] hover:bg-[#F5F7FB] transition-colors">
                  <Paperclip className="w-4 h-4" strokeWidth={2} />
                </button>
                <button type="button" className="p-2 text-[#94A3B8] hover:text-[#64748B] rounded-[10px] hover:bg-[#F5F7FB] transition-colors">
                  <Mic className="w-4 h-4" strokeWidth={2} />
                </button>
                <button type="submit" className="p-2.5 rounded-[12px] bg-[#4F7DF6] text-white hover:bg-[#3D6CF2] transition-colors">
                  <Send className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
