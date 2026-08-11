import React, { useState } from 'react';
import { Play, Heart, MessageCircle, Share2, Sparkles, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { Avatar, Badge } from '../../components/ui/index.jsx';

const reels = [
  {
    id: 1,
    title: 'Visualizing Matrix Multiplication in 30 Seconds 📐',
    teacher: 'Dr. Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100',
    likes: '4.2K',
    comments: '182',
    subject: 'Mathematics',
    videoBg: 'bg-gradient-to-br from-blue-900 to-indigo-900',
  },
  {
    id: 2,
    title: 'Quantum Entanglement Trick — Spooky Action at a Distance ⚛️',
    teacher: 'Prof. Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
    likes: '8.9K',
    comments: '412',
    subject: 'Physics',
    videoBg: 'bg-gradient-to-br from-purple-900 to-slate-900',
  },
];

export default function ReelsPage() {
  const navigate = useNavigate();
  const [muted, setMuted] = useState(true);

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 max-w-md mx-auto h-[calc(100vh-5rem)] flex flex-col justify-center pb-24 md:pb-8">
        <div className="relative w-full h-[650px] rounded-[24px] overflow-hidden border border-[#E2E8F0] shadow-xl flex flex-col justify-between p-6 bg-slate-900 text-white">
          {/* Header */}
          <div className="flex items-center justify-between z-10">
            <button onClick={() => navigate(-1)} className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <Badge variant="primary">StudyReels</Badge>
            <button onClick={() => setMuted(!muted)} className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white">
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Center Play Icon visual */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <Play className="w-20 h-20 text-white" />
          </div>

          {/* Bottom Info & Action overlay */}
          <div className="z-10 flex items-end justify-between gap-4">
            <div className="space-y-3 max-w-[80%]">
              <div className="flex items-center gap-2">
                <Avatar src={reels[0].avatar} size="sm" />
                <span className="text-xs font-bold">{reels[0].teacher}</span>
              </div>
              <p className="text-sm font-semibold leading-snug">{reels[0].title}</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] backdrop-blur-md">
                #{reels[0].subject}
              </span>
            </div>

            <div className="flex flex-col items-center gap-4 text-xs font-semibold">
              <button className="flex flex-col items-center gap-1 hover:text-rose-400">
                <div className="p-3 bg-black/40 backdrop-blur-md rounded-full"><Heart className="w-5 h-5" /></div>
                <span>{reels[0].likes}</span>
              </button>
              <button className="flex flex-col items-center gap-1 hover:text-blue-400">
                <div className="p-3 bg-black/40 backdrop-blur-md rounded-full"><MessageCircle className="w-5 h-5" /></div>
                <span>{reels[0].comments}</span>
              </button>
              <button className="flex flex-col items-center gap-1">
                <div className="p-3 bg-black/40 backdrop-blur-md rounded-full"><Share2 className="w-5 h-5" /></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
