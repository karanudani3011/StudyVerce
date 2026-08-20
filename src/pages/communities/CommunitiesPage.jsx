import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Mic, Calendar, Plus, Share2, Link2, Sparkles, AlertCircle, ShieldCheck, Trash2 } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Badge, Avatar } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';
import { useCommunities } from '../../context/CommunityContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { CreateCommunityModal } from '../../components/communities/CreateCommunityModal';
import { CommunityPaymentModal } from '../../components/communities/CommunityPaymentModal';
import { ShareCommunityModal } from '../../components/communities/ShareCommunityModal';

export default function CommunitiesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { communities, joinCommunity, copyShareLink, deleteCommunity } = useCommunities();
  const { showToast } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPaywallCommunity, setSelectedPaywallCommunity] = useState(null);
  const [selectedShareCommunity, setSelectedShareCommunity] = useState(null);

  const handleJoin = (e, comm) => {
    e.stopPropagation();
    const result = joinCommunity(comm.id);

    if (result.alreadyJoined) {
      showToast('You are already a member!', 'info');
    } else if (result.requiresPayment) {
      setSelectedPaywallCommunity(result.community);
    } else if (result.success) {
      showToast(`Joined "${comm.name}" for free! 🎉 (+50 XP)`, 'success');
    }
  };

  const handleShare = async (e, comm) => {
    e.stopPropagation();
    setSelectedShareCommunity(comm);
    await copyShareLink(comm.id);
  };

  const handleDelete = (e, comm) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${comm.name}"? This action cannot be undone.`)) {
      deleteCommunity(comm.id);
      showToast(`Community "${comm.name}" has been deleted.`, 'info');
    }
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24 md:pb-8">
        
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-[24px] text-white shadow-xl">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-bold border border-white/15 inline-flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Peer Academic Lounges
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Student Communities</h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Create your own community, generate share links, and study together. (First 10 members join free!)
            </p>
          </div>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsCreateOpen(true)}
            className="bg-[#4F7DF6] hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 shrink-0"
          >
            Create Community
          </Button>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map(comm => {
            const isFull = comm.members >= (comm.membersCap || 10);
            const freeSlotsLeft = Math.max(0, (comm.membersCap || 10) - comm.members);
            const isOwner = comm.creatorId === user?.id || comm.id.startsWith('cm_') || comm.creatorName === user?.name;

            return (
              <Card
                key={comm.id}
                hover
                onClick={() => navigate(`/communities/${comm.id}`)}
                className="flex flex-col justify-between p-5 space-y-4 cursor-pointer group border border-[#E2E8F0] hover:border-[#4F7DF6]/40 transition-all shadow-sm"
              >
                <div className="space-y-4">
                  {/* Banner & Badges */}
                  <div className="relative h-32 -mx-5 -mt-5 overflow-hidden rounded-t-[20px] bg-slate-100">
                    <img
                      src={comm.banner}
                      alt={comm.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-xs font-bold text-[#1E293B] border border-[#E2E8F0] shadow-sm flex items-center gap-1.5">
                      <span>{comm.icon}</span>
                      <span>{comm.subject}</span>
                    </div>

                    {/* Delete Icon Button for Owner / Creator */}
                    {isOwner && (
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, comm)}
                        className="absolute top-3 right-3 p-1.5 bg-rose-500/90 hover:bg-rose-600 text-white rounded-full transition-colors shadow-md border border-rose-400"
                        title="Delete Community"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Member Limit Status Badge */}
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold backdrop-blur-md border shadow-sm flex items-center gap-1">
                      {isFull ? (
                        <span className="bg-rose-500/90 text-white border-rose-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> 10/10 Free Full (₹{comm.joiningFee || 199})
                        </span>
                      ) : (
                        <span className="bg-emerald-500/90 text-white border-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> {freeSlotsLeft} Free Slot{freeSlotsLeft !== 1 ? 's' : ''} Left
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-[#1E293B] group-hover:text-[#4F7DF6] transition-colors leading-tight">
                      {comm.name}
                    </h3>
                    <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                      {comm.description}
                    </p>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="space-y-3 pt-3 border-t border-[#EDF2F7]">
                  <div className="flex items-center justify-between text-xs text-[#64748B]">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#4F7DF6]" />
                      <span className="font-bold text-[#1E293B]">{comm.members}</span> / 10 Free Members
                    </div>
                    {comm.activeVoiceRooms > 0 && (
                      <Badge variant="success" icon={Mic}>{comm.activeVoiceRooms} Live Voice</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Share Link Button */}
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      icon={Share2}
                      onClick={(e) => handleShare(e, comm)}
                      className="px-3 text-xs"
                      title="Share Community"
                    >
                      Share
                    </Button>

                    {/* Delete Button if Owner */}
                    {isOwner && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        icon={Trash2}
                        onClick={(e) => handleDelete(e, comm)}
                        className="px-2.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                        title="Delete Community"
                      />
                    )}

                    {/* Join / Status Button */}
                    <Button
                      type="button"
                      variant={comm.joined ? "secondary" : isFull ? "accent" : "primary"}
                      size="sm"
                      fullWidth
                      onClick={(e) => handleJoin(e, comm)}
                      className={isFull && !comm.joined ? "bg-purple-600 hover:bg-purple-700 text-white font-bold" : ""}
                    >
                      {comm.joined
                        ? "Joined ✓"
                        : isFull
                        ? `Join (₹${comm.joiningFee || 199})`
                        : "Join Community Free"}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Modals */}
        <CreateCommunityModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />

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
