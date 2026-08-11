import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Paperclip } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Avatar } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';
import { MOCK_MESSAGES } from '../../data/mockData';

export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const chat = MOCK_MESSAGES.find(m => m.id === id) || MOCK_MESSAGES[0];
  const [input, setInput] = useState('');
  const [chats, setChats] = useState([
    { sender: 'them', text: 'Hey Alex! Great job on that Backpropagation note.' },
    { sender: 'me', text: 'Thanks Sarah! Let me know if you need the derivation for the chain rule step.' },
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setChats([...chats, { sender: 'me', text: input }]);
    setInput('');
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto p-4 sm:p-6 pb-24 md:pb-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0]">
          <button onClick={() => navigate(-1)} className="text-[#64748B] hover:text-[#1E293B]"><ArrowLeft className="w-5 h-5" /></button>
          <Avatar src={chat.user.avatar} size="sm" status={chat.user.online ? 'online' : 'offline'} />
          <h2 className="text-sm font-bold text-[#1E293B]">{chat.user.name}</h2>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {chats.map((c, i) => (
            <div key={i} className={`flex ${c.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md p-3 rounded-[16px] text-xs font-medium ${c.sender === 'me' ? 'bg-[#4F7DF6] text-white' : 'bg-white border border-[#E2E8F0] text-[#1E293B]'}`}>
                {c.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="flex gap-2 pt-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 bg-white border border-[#E2E8F0] rounded-[14px] px-4 py-2.5 text-xs focus:outline-none focus:border-[#4F7DF6]"
          />
          <Button type="submit" size="sm" icon={Send}>Send</Button>
        </form>
      </div>
    </AppLayout>
  );
}
