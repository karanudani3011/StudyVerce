import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_COMMUNITIES } from '../data/mockData';
import { apiGet, apiPost, apiDelete } from '../config/api';

const CommunityContext = createContext(null);

const STORAGE_KEY = 'sv_communities_data';

// Helper to normalize initial communities from mockData
const getInitialCommunities = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse communities from storage', e);
    }
  }

  return MOCK_COMMUNITIES.map((c, idx) => {
    let memberCount = 8;
    if (idx === 1) memberCount = 10;
    if (idx === 2) memberCount = 5;

    return {
      ...c,
      members: memberCount,
      membersCap: 10,
      joiningFee: 199,
      creatorName: idx === 0 ? 'Dr. Sarah Chen' : idx === 1 ? 'Prof. Marcus Vance' : 'Topper Community',
    };
  });
};

export const CommunityProvider = ({ children }) => {
  const [communities, setCommunities] = useState(getInitialCommunities);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(communities));
  }, [communities]);

  // Try fetching MongoDB communities on mount
  useEffect(() => {
    const fetchDbCommunities = async () => {
      try {
        const res = await apiGet('/communities');
        if (res?.data && res.data.length > 0) {
          const dbCommunities = res.data.map(item => ({
            ...item,
            id: item._id || item.id,
          }));
          // Merge with initial local defaults to avoid empty view
          setCommunities(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const newDbItems = dbCommunities.filter(d => !existingIds.has(d.id));
            return [...newDbItems, ...prev];
          });
        }
      } catch (err) {
        console.warn('MongoDB sync notice (using local storage fallback):', err.message);
      }
    };
    fetchDbCommunities();
  }, []);

  // Create Community function with MongoDB Persistence
  const createCommunity = (newCommunityData, user) => {
    const newId = 'cm_' + Date.now();
    const newComm = {
      id: newId,
      name: newCommunityData.name,
      icon: newCommunityData.icon || '🚀',
      subject: newCommunityData.subject || 'General Study',
      description: newCommunityData.description,
      banner: newCommunityData.banner || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
      members: 1, // Creator is member #1
      membersCap: 10,
      joiningFee: Number(newCommunityData.joiningFee) || 199,
      joined: true,
      creatorId: user?.id || 'u1',
      creatorName: user?.name || 'Student Creator',
      creatorPayoutDetails: newCommunityData.creatorPayoutDetails || {
        upiId: `${(user?.name || 'creator').toLowerCase().replace(/\s+/g, '')}@upi`,
        accountName: user?.name || 'Community Creator',
        payoutNote: 'Direct payout to creator account',
      },
      totalEarnings: 0,
      activeVoiceRooms: 1,
      events: [
        {
          title: `Welcome to ${newCommunityData.name}!`,
          time: 'Upcoming Study Lounge Session',
          host: user?.name || 'Community Host'
        }
      ]
    };

    // Store in state immediately
    setCommunities(prev => [newComm, ...prev]);

    // Persist to MongoDB backend
    apiPost('/communities', newCommunityData).catch(err => {
      console.warn('MongoDB save community warning:', err.message);
    });

    return newComm;
  };

  // Join Community
  const joinCommunity = (communityId) => {
    const target = communities.find(c => c.id === communityId);
    if (!target) return { success: false, message: 'Community not found' };

    if (target.joined) {
      return { success: true, alreadyJoined: true, message: 'You are already a member of this community' };
    }

    if (target.members >= target.membersCap) {
      return {
        success: false,
        requiresPayment: true,
        community: target,
        joiningFee: target.joiningFee || 199,
        message: `Member limit reached (${target.members}/10 free members). Paid pass required.`
      };
    }

    setCommunities(prev =>
      prev.map(c =>
        c.id === communityId ? { ...c, members: c.members + 1, joined: true } : c
      )
    );

    apiPost(`/communities/${communityId}/join`, {}).catch(() => {});

    return { success: true, paid: false, message: 'Joined community for free!' };
  };

  // Confirm Paid Join
  const payAndJoinCommunity = (communityId) => {
    setCommunities(prev =>
      prev.map(c =>
        c.id === communityId ? { ...c, members: c.members + 1, joined: true } : c
      )
    );
    return { success: true, paid: true, message: 'Payment successful! Joined community.' };
  };

  // Generate share link & copy to clipboard safely with fallback
  const copyShareLink = async (communityId) => {
    const shareUrl = `${window.location.origin}/communities/${communityId}`;
    let success = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        success = true;
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        success = document.execCommand('copy');
        textArea.remove();
      }
    } catch (err) {
      console.error('Clipboard copy error', err);
    }

    if (success) {
      return { success: true, url: shareUrl, message: 'Community link copied to clipboard!' };
    } else {
      return { success: false, url: shareUrl, message: 'Link: ' + shareUrl };
    }
  };

  // Delete Community function with MongoDB Persistence
  const deleteCommunity = (communityId) => {
    setCommunities(prev => prev.filter(c => c.id !== communityId));
    apiDelete(`/communities/${communityId}`).catch(() => {});
    return { success: true, message: 'Community deleted successfully' };
  };

  return (
    <CommunityContext.Provider value={{
      communities,
      createCommunity,
      joinCommunity,
      payAndJoinCommunity,
      copyShareLink,
      deleteCommunity
    }}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunities = () => {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error('useCommunities must be used within CommunityProvider');
  return ctx;
};
