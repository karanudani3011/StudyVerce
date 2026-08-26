import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, GraduationCap, RefreshCw, AlertTriangle, ShieldAlert, X } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Avatar } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { apiGet, apiPost } from '../../config/api';

export default function ChatPage() {
  const { id: recipientId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { addToast } = useToast();

  const [recipient, setRecipient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [policyWarning, setPolicyWarning] = useState(null);

  const chatBottomRef = useRef(null);

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      const res = await apiGet(`/messages/${recipientId}`);
      if (res.success) {
        setRecipient(res.recipient);
        setMessages(res.messages || []);
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
      addToast(err.message || 'Failed to load conversation history.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (recipientId) {
      fetchChatHistory();
    }
  }, [recipientId]);

  useEffect(() => {
    // Scroll to bottom when messages update
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    setPolicyWarning(null);
    const messageText = inputText.trim();

    // Client-side quick check for informal chit chat (e.g. 'how are you', 'what are you doing', 'wyd', 'what's up')
    const informalRegex = /\b(how\s+are\s+you|how\s+r\s+u|hru|what\s+are\s+you\s+doing|what\s+r\s+u\s+doing|wyd|what'?s?\s+up|whatsup|wbu|where\s+are\s+you|wru|are\s+you\s+free|call\s+me|date|meet\s+me|single|love\s+you)\b/i;
    
    if (informalRegex.test(messageText)) {
      setPolicyWarning(
        "Educational Policy Warning: Personal informal chit-chat (such as 'how are you' or 'what are you doing') is not permitted. Please keep messages formal (e.g. 'Hi', 'Hello', 'Good morning') or related to coursework, notes, and study topics."
      );
      addToast('Message blocked by Educational Moderation Filter ⚠️', 'error');
      return;
    }

    setInputText('');

    // Optimistic UI update
    const tempMsg = {
      id: `temp-${Date.now()}`,
      senderId: currentUser?.id || currentUser?._id,
      receiverId: recipientId,
      text: messageText,
      createdAt: new Date().toISOString(),
      isMe: true,
    };

    setMessages((prev) => [...prev, tempMsg]);

    try {
      setSending(true);
      const res = await apiPost('/messages/send', {
        receiverId: recipientId,
        text: messageText,
      });

      if (res.success && res.message) {
        // Replace temp message with server response
        setMessages((prev) =>
          prev.map((m) => (m.id === tempMsg.id ? res.message : m))
        );
      } else {
        // Remove temp message if failed or warning returned
        setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
        setInputText(messageText);
        if (res.isWarning || res.message) {
          setPolicyWarning(res.message);
          addToast('Message not sent: Educational Moderation Policy ⚠️', 'error');
        }
      }
    } catch (err) {
      console.error('Send Message Error:', err);
      // Remove temp message
      setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
      setInputText(messageText);
      setPolicyWarning(err.message || 'Informal personal messages are not permitted on StudyVerse.');
      addToast(err.message || 'Failed to send message.', 'error');
    } finally {
      setSending(false);
    }
  };

  const isFaculty = recipient?.role === 'faculty' || recipient?.role === 'tutor';

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto p-3 sm:p-6 pb-24 md:pb-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#E2E8F0] bg-white/80 backdrop-blur-sm rounded-t-2xl p-3 sm:p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/messages')}
              className="p-2 rounded-xl text-[#64748B] hover:text-[#1E293B] hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="relative">
              <Avatar
                src={recipient?.avatar}
                alt={recipient?.name || 'User'}
                size="md"
              />
              {isFaculty && (
                <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-0.5 rounded-full ring-2 ring-white">
                  <GraduationCap className="w-3.5 h-3.5" />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-[#1E293B]">
                  {recipient?.name || 'Loading Chat...'}
                </h2>
                {isFaculty ? (
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-black border border-amber-200">
                    Faculty Educator
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                    Student
                  </span>
                )}
              </div>
              <p className="text-xs text-[#64748B] font-medium">
                {recipient?.department || recipient?.institution || 'StudyVerse Community'}
              </p>
            </div>
          </div>

          <button
            onClick={fetchChatHistory}
            className="p-2 rounded-xl text-[#94A3B8] hover:text-[#4F7DF6] hover:bg-blue-50 transition-colors"
            title="Refresh Messages"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto py-4 px-2 sm:px-4 space-y-3.5 bg-slate-50/50 rounded-b-2xl border-x border-b border-[#E2E8F0] shadow-inner">
          {loading ? (
            <div className="p-8 text-center text-xs text-[#94A3B8] font-bold">
              Loading chat history...
            </div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#4F7DF6] flex items-center justify-center mx-auto">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-extrabold text-[#1E293B]">No messages yet</h3>
              <p className="text-xs text-[#64748B] max-w-xs mx-auto">
                Send a formal greeting or course inquiry to start your conversation with {recipient?.name}.
              </p>
            </div>
          ) : (
            messages.map((c) => (
              <div
                key={c.id}
                className={`flex ${c.isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs sm:max-w-md p-3.5 rounded-[18px] text-xs font-medium space-y-1 shadow-sm ${
                    c.isMe
                      ? 'bg-gradient-to-r from-[#4F7DF6] to-[#3B82F6] text-white rounded-br-none'
                      : 'bg-white border border-[#E2E8F0] text-[#1E293B] rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{c.text}</p>
                  <div
                    className={`text-[9px] font-bold text-right ${
                      c.isMe ? 'text-blue-100' : 'text-[#94A3B8]'
                    }`}
                  >
                    {new Date(c.createdAt).toLocaleTimeString([], {
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

        {/* ⚠️ EDUCATIONAL POLICY WARNING ALERT BOX */}
        {policyWarning && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start justify-between gap-3 text-xs text-red-800 shadow-sm animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-red-900">Educational Moderation Warning</h4>
                <p className="text-[11px] leading-relaxed mt-0.5">{policyWarning}</p>
              </div>
            </div>
            <button
              onClick={() => setPolicyWarning(null)}
              className="text-red-500 hover:text-red-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSend} className="flex gap-2 pt-3">
          <input
            type="text"
            placeholder={`Send formal greeting or study query to ${recipient?.name || 'user'}...`}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (policyWarning) setPolicyWarning(null);
            }}
            className="flex-1 bg-white border border-[#E2E8F0] rounded-[16px] px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#4F7DF6] shadow-sm transition-all"
          />
          <Button
            type="submit"
            disabled={!inputText.trim() || sending}
            className="rounded-[16px] px-5 py-3 bg-[#4F7DF6] hover:bg-[#3B82F6] text-white text-xs font-extrabold shadow-md shadow-blue-500/20"
            icon={Send}
          >
            Send
          </Button>
        </form>

      </div>
    </AppLayout>
  );
}
