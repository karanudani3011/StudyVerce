import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, Search, GraduationCap, Users, UserCheck,
  Sparkles, CheckCheck, Clock, X, ArrowRight, ShieldCheck, Filter
} from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Avatar } from '../../components/ui/index.jsx';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { apiGet } from '../../config/api';

export default function MessagesPage() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('faculty'); // 'faculty', 'students', 'chats', 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Directory (All Faculty & Students from MongoDB / Server)
  const fetchDirectory = async (query = '') => {
    try {
      setLoading(true);
      const res = await apiGet(`/messages/users/search?q=${encodeURIComponent(query)}`);
      if (res.success && res.users) {
        setMembers(res.users);
      }
    } catch (err) {
      console.error('Fetch Directory Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Active Conversations
  const fetchConversations = async () => {
    try {
      const res = await apiGet('/messages/conversations');
      if (res.success && res.conversations) {
        setConversations(res.conversations);
      }
    } catch (err) {
      console.error('Fetch Conversations Error:', err);
    }
  };

  useEffect(() => {
    fetchDirectory('');
    fetchConversations();
  }, []);

  // Handle Search Input Change
  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    fetchDirectory(q);
  };

  const startChat = (userId) => {
    navigate(`/messages/${userId}`);
  };

  // Filter members based on active Tab
  const filteredMembers = members.filter((m) => {
    if (activeTab === 'faculty') {
      return m.role === 'faculty' || m.role === 'tutor';
    }
    if (activeTab === 'students') {
      return m.role !== 'faculty' && m.role !== 'tutor';
    }
    return true; // 'all'
  });

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 pb-24 md:pb-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-0.5 rounded-full bg-blue-50 text-[#4F7DF6] text-[11px] font-extrabold border border-blue-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#4F7DF6]" />
                Direct Study & Academic Messenger
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1E293B]">StudyVerse Messenger</h1>
            <p className="text-xs sm:text-sm text-[#64748B] font-medium">
              Instagram & LinkedIn style direct messaging — connect with verified faculty educators and fellow students.
            </p>
          </div>
        </div>

        {/* Search Bar & Tab Navigation */}
        <div className="space-y-4">
          
          {/* Main Search Bar */}
          <div className="relative">
            <Search className="w-4.5 h-4.5 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search faculty, students, or study partners by name, email, or department..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full bg-white border border-[#E2E8F0] rounded-2xl pl-11 pr-10 py-3 text-xs font-semibold focus:outline-none focus:border-[#4F7DF6] shadow-sm transition-all text-[#1E293B]"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  fetchDirectory('');
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Directory Tabs (Instagram / LinkedIn Filter Pills) */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-[#E2E8F0] shadow-sm overflow-x-auto">
            {[
              { id: 'faculty', label: '🎓 Verified Faculty Directory', count: members.filter(m => m.role === 'faculty' || m.role === 'tutor').length },
              { id: 'students', label: '👥 Student Classmates', count: members.filter(m => m.role !== 'faculty' && m.role !== 'tutor').length },
              { id: 'all', label: '🌟 All Members', count: members.length },
              { id: 'chats', label: '💬 Recent Active Chats', count: conversations.length },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activeTab === t.id
                    ? 'bg-[#1E293B] text-white shadow-md'
                    : 'text-[#64748B] hover:bg-slate-100 hover:text-[#1E293B]'
                }`}
              >
                <span>{t.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  activeTab === t.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#64748B]'
                }`}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

        </div>

        {/* ─── TAB CONTENT DISPLAY ────────────────────────────────────────────── */}

        {/* TAB 1, 2, 3: MEMBERS DIRECTORY (FACULTY / STUDENTS / ALL) */}
        {activeTab !== 'chats' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-[#64748B] uppercase tracking-wider">
                {activeTab === 'faculty' && '🎓 Verified Faculty Educators Directory'}
                {activeTab === 'students' && '👥 Student Community Directory'}
                {activeTab === 'all' && '🌟 All StudyVerse Members'}
              </h3>
              <span className="text-xs text-[#94A3B8] font-bold">
                Showing {filteredMembers.length} member{filteredMembers.length === 1 ? '' : 's'}
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-xs text-[#94A3B8] font-bold bg-white rounded-2xl border border-[#E2E8F0]">
                Loading StudyVerse member directory...
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="p-12 text-center space-y-2 bg-white rounded-2xl border border-[#E2E8F0]">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#4F7DF6] flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-extrabold text-[#1E293B]">No members found</h3>
                <p className="text-xs text-[#64748B]">Try clearing your search query or switching tabs.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredMembers.map((m) => {
                  const isFaculty = m.role === 'faculty' || m.role === 'tutor';
                  return (
                    <div
                      key={m._id}
                      onClick={() => startChat(m._id)}
                      className="p-4 bg-white rounded-[22px] border border-[#E2E8F0] hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer flex items-center justify-between gap-3 group relative overflow-hidden"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative shrink-0">
                          <Avatar src={m.avatar} alt={m.name} size="lg" />
                          {isFaculty && (
                            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full ring-2 ring-white shadow-sm" title="Verified Faculty">
                              <GraduationCap className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-extrabold text-[#1E293B] truncate group-hover:text-[#4F7DF6] transition-colors">
                              {m.name}
                            </h4>
                            {isFaculty ? (
                              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-300 shrink-0">
                                Faculty Educator
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold shrink-0">
                                Student
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#64748B] font-medium truncate mt-0.5">
                            {m.department || m.institution || 'StudyVerse'}
                          </p>
                          <p className="text-[11px] text-[#94A3B8] font-semibold truncate">
                            {m.email}
                          </p>
                        </div>
                      </div>

                      <button className="px-4 py-2 rounded-xl bg-blue-50 group-hover:bg-[#4F7DF6] text-[#4F7DF6] group-hover:text-white text-xs font-black transition-colors shrink-0 flex items-center gap-1.5 shadow-sm">
                        <MessageSquare className="w-3.5 h-3.5" />
                        Message
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: RECENT ACTIVE CHATS */}
        {activeTab === 'chats' && (
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-[#64748B] uppercase tracking-wider">
              Recent Message Conversations
            </h3>

            <Card className="divide-y divide-[#EDF2F7] p-0 overflow-hidden shadow-sm border border-[#E2E8F0]">
              {conversations.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#4F7DF6] flex items-center justify-center mx-auto">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-extrabold text-[#1E293B]">No direct conversations yet</h3>
                  <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                    Switch to the 🎓 Faculty Directory or 👥 Students tab above to start messaging anyone on StudyVerse!
                  </p>
                  <button
                    onClick={() => setActiveTab('faculty')}
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4F7DF6] text-white text-xs font-extrabold hover:bg-blue-600 transition-colors shadow-sm"
                  >
                    Browse Faculty Directory
                  </button>
                </div>
              ) : (
                conversations.map((c) => {
                  const isFaculty = c.recipient?.role === 'faculty' || c.recipient?.role === 'tutor';
                  return (
                    <div
                      key={c.id}
                      onClick={() => navigate(`/messages/${c.id}`)}
                      className="p-4 flex items-center justify-between hover:bg-[#F8FAFC] cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative shrink-0">
                          <Avatar
                            src={c.recipient?.avatar}
                            alt={c.recipient?.name}
                            size="md"
                          />
                          {isFaculty && (
                            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-0.5 rounded-full ring-2 ring-white">
                              <GraduationCap className="w-3 h-3" />
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-extrabold text-[#1E293B] truncate group-hover:text-[#4F7DF6] transition-colors">
                              {c.recipient?.name}
                            </h4>
                            {isFaculty ? (
                              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black border border-amber-200">
                                Faculty
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                                Student
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#64748B] line-clamp-1 mt-0.5 font-medium">
                            {c.lastMessage || 'Click to open conversation...'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 ml-4 flex flex-col items-end">
                        <span className="text-[10px] text-[#94A3B8] font-bold block mb-1">
                          {c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                        {c.unreadCount > 0 && (
                          <span className="bg-[#4F7DF6] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                            {c.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </Card>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
