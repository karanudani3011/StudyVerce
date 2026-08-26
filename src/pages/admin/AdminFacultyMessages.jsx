import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, GraduationCap, Send, Search, ShieldCheck,
  RefreshCw, CheckCircle2, AlertCircle, Sparkles, UserCheck, Shield
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { apiGet, apiPost } from '../../config/api';
import { useToast } from '../../context/ToastContext';

export default function AdminFacultyMessages() {
  const { addToast } = useToast();

  const [facultyList, setFacultyList] = useState([]);
  const [loadingFaculty, setLoadingFaculty] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);

  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);

  const chatBottomRef = useRef(null);

  // Fetch Faculty List (Students strictly excluded)
  const fetchFaculty = async () => {
    try {
      setLoadingFaculty(true);
      const res = await apiGet('/admin/faculty-messages/list');
      if (res.success && res.faculty) {
        setFacultyList(res.faculty);
        if (res.faculty.length > 0 && !selectedFaculty) {
          setSelectedFaculty(res.faculty[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load faculty for messaging:', err);
      addToast('Failed to load faculty educators list.', 'error');
    } finally {
      setLoadingFaculty(false);
    }
  };

  // Fetch Chat History when a faculty member is selected
  const fetchChatHistory = async (facultyId) => {
    if (!facultyId) return;
    try {
      setLoadingChat(true);
      const res = await apiGet(`/admin/faculty-messages/${facultyId}`);
      if (res.success && res.messages) {
        setMessages(res.messages);
      }
    } catch (err) {
      console.error('Failed to load admin-faculty chat history:', err);
      addToast('Failed to load chat history.', 'error');
    } finally {
      setLoadingChat(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  useEffect(() => {
    if (selectedFaculty?._id) {
      fetchChatHistory(selectedFaculty._id);
    }
  }, [selectedFaculty]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedFaculty || sending) return;

    const messageText = inputText.trim();
    setInputText('');

    // Optimistic UI update
    const tempMsg = {
      id: `temp-${Date.now()}`,
      senderId: 'admin',
      receiverId: selectedFaculty._id,
      text: messageText,
      createdAt: new Date().toISOString(),
      isMe: true,
    };

    setMessages((prev) => [...prev, tempMsg]);

    try {
      setSending(true);
      const res = await apiPost('/admin/faculty-messages/send', {
        facultyId: selectedFaculty._id,
        text: messageText,
      });

      if (res.success && res.message) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempMsg.id ? res.message : m))
        );
        addToast(`Official message sent to ${selectedFaculty.name}`, 'success');
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
        setInputText(messageText);
        addToast(res.message || 'Failed to send message.', 'error');
      }
    } catch (err) {
      console.error('Send Admin Message Error:', err);
      setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
      setInputText(messageText);
      addToast(err.message || 'Failed to send message.', 'error');
    } finally {
      setSending(false);
    }
  };

  const filteredFaculty = facultyList.filter((f) => {
    const q = searchQuery.toLowerCase();
    return (
      f.name?.toLowerCase().includes(q) ||
      f.email?.toLowerCase().includes(q) ||
      f.department?.toLowerCase().includes(q) ||
      f.institution?.toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        
        {/* Page Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0B1522] p-5 rounded-3xl border border-[#1E293B] shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/20 uppercase tracking-widest flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-emerald-400" />
                Admin Communication Portal
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Faculty Direct Messaging</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Send official administrative notices, announcements, and direct messages exclusively to verified Faculty Educators.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 text-xs font-extrabold border border-amber-500/20 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              Faculty Members Only ({facultyList.length})
            </span>
          </div>
        </div>

        {/* Messaging Interface Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[620px]">
          
          {/* LEFT PANEL: FACULTY MEMBERS DIRECTORY (Students Excluded) */}
          <div className="md:col-span-5 bg-[#0B1522] rounded-3xl border border-[#1E293B] flex flex-col overflow-hidden shadow-xl">
            
            {/* Faculty Search & Header */}
            <div className="p-4 border-b border-[#1E293B] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  Verified Faculty List
                </h3>
                <button
                  onClick={fetchFaculty}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-[#132235] transition-colors"
                  title="Refresh List"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingFaculty ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search faculty by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#132235] border border-[#1E293B] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Faculty Cards List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#1E293B]/60 p-2 space-y-1">
              {loadingFaculty ? (
                <div className="p-8 text-center text-xs text-slate-500 font-bold">
                  Loading verified faculty list...
                </div>
              ) : filteredFaculty.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 font-semibold">
                  No faculty educators found matching "{searchQuery}"
                </div>
              ) : (
                filteredFaculty.map((f) => {
                  const isSelected = selectedFaculty?._id === f._id;
                  return (
                    <div
                      key={f._id}
                      onClick={() => setSelectedFaculty(f)}
                      className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-emerald-700/20 border border-emerald-500/40 shadow-lg'
                          : 'hover:bg-[#132235]/70 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <img
                            src={f.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?auto=format&fit=crop&q=80&w=100'}
                            alt={f.name}
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/30"
                          />
                          <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-0.5 rounded-full ring-2 ring-[#0B1522]">
                            <GraduationCap className="w-3 h-3" />
                          </span>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-black text-white truncate">{f.name}</h4>
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-black shrink-0 border border-amber-500/30">
                              Faculty
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">
                            {f.department || f.institution || 'StudyVerse Educator'}
                          </p>
                        </div>
                      </div>

                      <button className={`px-2.5 py-1 rounded-xl text-[11px] font-black shrink-0 transition-colors ${
                        isSelected ? 'bg-emerald-500 text-white' : 'bg-[#132235] text-slate-300 hover:text-white'
                      }`}>
                        Chat
                      </button>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* RIGHT PANEL: LIVE CHAT WINDOW WITH SELECTED FACULTY MEMBER */}
          <div className="md:col-span-7 bg-[#0B1522] rounded-3xl border border-[#1E293B] flex flex-col overflow-hidden shadow-xl">
            
            {selectedFaculty ? (
              <>
                {/* Selected Faculty Header */}
                <div className="p-4 border-b border-[#1E293B] bg-[#0F1B2B]/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedFaculty.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?auto=format&fit=crop&q=80&w=100'}
                      alt={selectedFaculty.name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/40"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-white">{selectedFaculty.name}</h3>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30">
                          Faculty Educator
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium">
                        {selectedFaculty.email} · {selectedFaculty.department || selectedFaculty.institution || 'StudyVerse'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => fetchChatHistory(selectedFaculty._id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-[#132235] transition-colors"
                    title="Refresh Chat"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingChat ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {/* Chat Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#060D17]/40">
                  {loadingChat ? (
                    <div className="p-8 text-center text-xs text-slate-500 font-bold">
                      Loading message history with {selectedFaculty.name}...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="p-12 text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-black text-white">No administrative messages yet</h4>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto">
                        Send an official notice or query to {selectedFaculty.name} below.
                      </p>
                    </div>
                  ) : (
                    messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs sm:max-w-md p-3.5 rounded-2xl text-xs font-medium space-y-1 shadow-md ${
                            m.isMe
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none border border-emerald-400/30'
                              : 'bg-[#132235] border border-[#1E293B] text-slate-200 rounded-bl-none'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                          <div
                            className={`text-[9px] font-mono font-semibold text-right ${
                              m.isMe ? 'text-emerald-100' : 'text-slate-400'
                            }`}
                          >
                            {new Date(m.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Input Bar */}
                <form onSubmit={handleSend} className="p-3 bg-[#0B1522] border-t border-[#1E293B] flex gap-2">
                  <input
                    type="text"
                    placeholder={`Send official message or notice to ${selectedFaculty.name}...`}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 bg-[#132235] border border-[#1E293B] rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || sending}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-black hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 text-slate-400">
                <GraduationCap className="w-12 h-12 text-emerald-400 opacity-60" />
                <h4 className="text-base font-black text-white">Select a Faculty Educator</h4>
                <p className="text-xs max-w-sm">
                  Choose a faculty member from the left panel to send administrative messages and notices.
                </p>
              </div>
            )}

          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
