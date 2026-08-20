import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Mic, Calendar, MessageSquare, ArrowLeft, Volume2, Share2, ShieldCheck, AlertCircle, Trash2 } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Badge, Avatar } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';
import { useCommunities } from '../../context/CommunityContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { CommunityPaymentModal } from '../../components/communities/CommunityPaymentModal';
import { ShareCommunityModal } from '../../components/communities/ShareCommunityModal';

export default function CommunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { communities, joinCommunity, copyShareLink, deleteCommunity } = useCommunities();
  const { showToast } = useToast();

  const [selectedPaywallCommunity, setSelectedPaywallCommunity] = useState(null);
  const [selectedShareCommunity, setSelectedShareCommunity] = useState(null);

  const comm = communities.find(c => c.id === id) || communities[0];
  const isFull = comm.members >= (comm.membersCap || 10);
  const freeSlotsLeft = Math.max(0, (comm.membersCap || 10) - comm.members);
  const isOwner = comm.creatorId === user?.id || comm.id.startsWith('cm_') || comm.creatorName === user?.name;

  const handleJoin = () => {
    const result = joinCommunity(comm.id);

    if (result.alreadyJoined) {
      showToast('You are already a member of this community!', 'info');
    } else if (result.requiresPayment) {
      setSelectedPaywallCommunity(result.community);
    } else if (result.success) {
      showToast(`Joined "${comm.name}" for free! 🎉 (+50 XP)`, 'success');
    }
  };

  const handleShare = async () => {
    setSelectedShareCommunity(comm);
    await copyShareLink(comm.id);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${comm.name}"? This action cannot be undone.`)) {
      deleteCommunity(comm.id);
      showToast(`Community "${comm.name}" has been deleted.`, 'info');
      navigate('/communities');
    }
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24 md:pb-8">
        <button
          onClick={() => navigate('/communities')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#1E293B] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Communities
        </button>

        {/* Banner Card */}
        <div className="relative rounded-[24px] overflow-hidden border border-[#E2E8F0] bg-white card-shadow">
          <img src={comm.banner} alt={comm.name} className="w-full h-56 object-cover" />
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-[20px] bg-white shadow-xl flex items-center justify-center text-3xl border border-[#E2E8F0] -mt-12 z-10 shrink-0">
                {comm.icon}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-extrabold text-[#1E293B]">{comm.name}</h1>
                  {isFull ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-xs font-bold border border-rose-200 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> 10/10 Free Full
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> {freeSlotsLeft} Free Slot{freeSlotsLeft !== 1 ? 's' : ''} Left
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#64748B]">
                  <span className="font-bold text-[#1E293B]">{comm.members}</span> / 10 Free Members · {comm.subject} · Created by {comm.creatorName || 'Student'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="secondary"
                icon={Share2}
                onClick={handleShare}
                className="px-4"
              >
                Share Link
              </Button>

              {isOwner && (
                <Button
                  variant="secondary"
                  icon={Trash2}
                  onClick={handleDelete}
                  className="px-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                  title="Delete Community"
                >
                  Delete
                </Button>
              )}

              <Button
                variant={comm.joined ? "secondary" : isFull ? "accent" : "primary"}
                onClick={handleJoin}
                className={isFull && !comm.joined ? "bg-purple-600 hover:bg-purple-700 text-white font-bold" : ""}
              >
                {comm.joined
                  ? "Joined Community ✓"
                  : isFull
                  ? `Join Pass (₹${comm.joiningFee || 199})`
                  : "Join Community Free"}
              </Button>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-4 flex gap-3 items-center">
              <Avatar size="sm" verified />
              <input
                type="text"
                placeholder={`Share a study note, paper, or question with ${comm.name}...`}
                className="flex-1 bg-[#F5F7FB] border border-[#E2E8F0] focus:border-[#4F7DF6] focus:bg-white rounded-[14px] px-4 py-2.5 text-xs sm:text-sm text-[#1E293B] outline-none transition-all"
              />
              <Button size="sm">Post</Button>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar size="sm" verified />
                <div>
                  <h4 className="text-xs font-bold text-[#1E293B]">{comm.creatorName || 'Dr. Sarah Chen'}</h4>
                  <p className="text-[10px] text-[#94A3B8]">Community Founder · 2 hrs ago</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#1E293B] leading-relaxed">
                Welcome to all new members of <span className="font-bold">{comm.name}</span>! Remember, our first 10 members join completely free. Use the "Share Link" button to invite study partners.
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar size="sm" />
                <div>
                  <h4 className="text-xs font-bold text-[#1E293B]">Alex Johnson</h4>
                  <p className="text-[10px] text-[#94A3B8]">Student Scholar · 5 hrs ago</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#1E293B] leading-relaxed">
                Has anyone reviewed the latest practice problems uploaded in the study room? Let's discuss them in the live voice lounge tonight!
              </p>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Live Voice Rooms */}
            <Card className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#1E293B]">Live Voice Lounges</h3>
                <Badge variant="success" icon={Volume2}>Live</Badge>
              </div>
              <div className="p-3.5 bg-emerald-50 rounded-[14px] border border-emerald-100 space-y-2">
                <p className="text-xs font-bold text-[#1E293B]">Quiet Study Lounge #1</p>
                <p className="text-[10px] text-[#64748B]">8 students currently studying together</p>
                <Button variant="success" size="xs" fullWidth>Join Voice Lounge</Button>
              </div>
            </Card>

            {/* Upcoming Events */}
            <Card className="space-y-3">
              <h3 className="text-sm font-bold text-[#1E293B]">Upcoming Events</h3>
              <div className="space-y-2">
                {(comm.events && comm.events.length > 0 ? comm.events : [
                  { title: 'Weekly Peer Study Group', time: 'Tomorrow · 6 PM IST', host: comm.creatorName || 'Community Host' }
                ]).map((ev, i) => (
                  <div key={i} className="p-3 bg-[#F8FAFC] rounded-[12px] border border-[#E2E8F0]">
                    <p className="text-xs font-bold text-[#1E293B]">{ev.title}</p>
                    <p className="text-[10px] text-[#64748B] mt-0.5">{ev.time}</p>
                    <p className="text-[10px] text-[#4F7DF6] font-semibold mt-1">Host: {ev.host}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Modals */}
        <CommunityPaymentModal
          community={selectedPaywallCommunity}
          isOpen={!!selectedPaywallCommunity}
          onClose={() => setSelectedPaywallCommunity(null)}
        />

        <ShareCommunityModal
          community={selectedShareCommunity}
          isOpen={!!selectedShareCommunity}
          onClose={() => setSelectedShareCommunity(null)}
        />
      </div>
    </AppLayout>
  );
}
