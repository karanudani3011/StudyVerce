import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Flame, Zap, Award, ChevronLeft, ChevronRight, Search, Users } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Avatar, Badge, Spinner, EmptyState, Button } from '../../components/ui/index.jsx';
import { useAuth } from '../../context/AuthContext';
import { apiGet } from '../../config/api';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [type, setType] = useState('xp'); // xp, streak
  const [searchQuery, setSearchQuery] = useState('');
  const [myRank, setMyRank] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet(`/leaderboard?limit=50&type=${type}`);
      if (res.success && res.data) {
        setLeaderboard(res.data);
      }
    } catch (error) {
      console.error('Leaderboard fetch error:', error.message);
      setError(error.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, [type]);

  const fetchMyRank = useCallback(async () => {
    try {
      const res = await apiGet('/leaderboard/my-rank');
      if (res.success && res.data) {
        setMyRank(res.data);
      }
    } catch (error) {
      console.error('My rank fetch error:', error.message);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await apiGet('/leaderboard/stats');
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (error) {
      console.error('Stats fetch error:', error.message);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
    if (user) fetchMyRank();
    fetchStats();
  }, [type, user, fetchLeaderboard, fetchMyRank, fetchStats]);

  const filteredLeaderboard = (leaderboard || []).filter(u =>
    (u?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u?.institution || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <Badge variant="warning" icon={Trophy}>Global Rankings</Badge>
            <h1 className="text-3xl font-extrabold text-[#1E293B]">StudyVerse Leaderboard</h1>
            <p className="text-sm text-[#64748B]">Compete with top scholars around the world based on XP & streaks.</p>
          </div>

          {/* Type Toggle */}
          <div className="flex items-center justify-center gap-2 p-1 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0] max-w-xs mx-auto">
            <button
              onClick={() => setType('xp')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                type === 'xp'
                  ? 'bg-white text-[#4F7DF6] shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> XP Rankings
            </button>
            <button
              onClick={() => setType('streak')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                type === 'streak'
                  ? 'bg-white text-amber-500 shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 fill-current" /> Streaks
            </button>
          </div>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search by name or institution..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] focus:border-[#4F7DF6] rounded-xl text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F7DF6]/15"
            />
          </div>

          {/* My Rank Card */}
          {myRank && (
            <Card className="p-4 border-2 border-[#4F7DF6]/30 bg-[#EEF4FF] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#4F7DF6] to-[#8B5CF6] flex items-center justify-center text-white font-black text-lg">
                    #{myRank.rank}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E293B]">Your Rank</h3>
                    <p className="text-xs text-[#64748B]">Top {myRank.percentile}% of {myRank.totalUsers?.toLocaleString() || 'all'} learners</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 font-bold text-[#4F7DF6]"><Zap className="w-4 h-4" /> {(myRank.xp || 0).toLocaleString()} XP</span>
                  <span className="flex items-center gap-1 font-bold text-amber-500"><Flame className="w-4 h-4 fill-current" /> {myRank.streak || 0}d streak</span>
                  <Badge variant="primary" size="sm">{myRank.badge}</Badge>
                </div>
              </div>
            </Card>
          )}

          {/* Stats Overview */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Students', value: (stats.totalStudents || 0).toLocaleString(), icon: Users, color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
                { label: 'Total Faculty', value: (stats.totalFaculty || 0).toLocaleString(), icon: Award, color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
                { label: 'Top Student XP', value: (stats.topXP?.student?.xp || 0).toLocaleString(), icon: Zap, color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
                { label: 'Top Student Streak', value: `${stats.topStreak?.student?.streak || 0}d`, icon: Flame, color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
              ].map((s, i) => (
                <Card key={i} className="p-4 space-y-2 border border-[#E2E8F0] hover:border-[#4F7DF6]/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#64748B]">{s.label}</span>
                    <div className={`p-2 rounded-[10px] ${s.color} border`}>
                      <s.icon className="w-5 h-5" strokeWidth={2} />
                    </div>
                  </div>
                  <p className="text-2xl font-extrabold text-[#1E293B]">{s.value}</p>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Podium Top 3 */}
        <div className="grid grid-cols-3 gap-4 items-end max-w-lg mx-auto pt-4">
          {filteredLeaderboard[1] && (
            <Card className="p-4 text-center space-y-2 border-2 border-[#E2E8F0] bg-[#F8FAFC] relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-200 text-slate-600 text-xs font-black">#2</span>
              <Avatar src={filteredLeaderboard[1].avatar} size="lg" className="mx-auto" />
              <h4 className="text-xs font-bold text-[#1E293B] truncate">{filteredLeaderboard[1].name}</h4>
              <span className="text-xs font-extrabold text-[#4F7DF6]">{(filteredLeaderboard[1].xp || 0).toLocaleString()} XP</span>
            </Card>
          )}
          {filteredLeaderboard[0] && (
            <Card className="p-5 text-center space-y-2 border-2 border-[#F59E0B] bg-amber-50/40 -mt-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-sm font-black">👑 #1</span>
              </div>
              <Avatar src={filteredLeaderboard[0].avatar} size="xl" className="mx-auto ring-4 ring-amber-400" />
              <h4 className="text-sm font-bold text-[#1E293B] truncate">{filteredLeaderboard[0].name}</h4>
              <span className="text-sm font-extrabold text-[#F59E0B]">{(filteredLeaderboard[0].xp || 0).toLocaleString()} XP</span>
            </Card>
          )}
          {filteredLeaderboard[2] && (
            <Card className="p-4 text-center space-y-2 border-2 border-[#E2E8F0] bg-[#F8FAFC] relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-200 text-slate-600 text-xs font-black">#3</span>
              <Avatar src={filteredLeaderboard[2].avatar} size="lg" className="mx-auto" />
              <h4 className="text-xs font-bold text-[#1E293B] truncate">{filteredLeaderboard[2].name}</h4>
              <span className="text-xs font-extrabold text-[#4F7DF6]">{(filteredLeaderboard[2].xp || 0).toLocaleString()} XP</span>
            </Card>
          )}
        </div>

        {/* List */}
        <Card className="divide-y divide-[#EDF2F7] p-0">
          {loading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="p-4 flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded bg-slate-200" />
                    <div className="w-10 h-10 rounded-full bg-slate-200" />
                    <div className="space-y-1">
                      <div className="h-3 w-24 bg-slate-200 rounded" />
                      <div className="h-2 w-16 bg-slate-200 rounded" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-3 w-16 bg-slate-200 rounded" />
                    <div className="h-3 w-20 bg-slate-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-rose-500 mb-2">Failed to load leaderboard</p>
              <Button variant="outline" size="sm" onClick={fetchLeaderboard}>Retry</Button>
            </div>
          ) : filteredLeaderboard.length === 0 ? (
            <EmptyState
              icon={<Trophy className="w-12 h-12 text-slate-400" />}
              title="No Rankings Found"
              description={searchQuery ? 'No users match your search. Try a different query.' : 'No leaderboard data available yet.'}
              action={searchQuery ? { label: 'Clear Search', onClick: () => setSearchQuery('') } : undefined}
            />
          ) : (
            filteredLeaderboard.map(u => (
              <div key={u.id || u.rank} className={`p-4 flex items-center justify-between hover:bg-[#F8FAFC] ${u.name === user?.name ? 'bg-[#EEF4FF] border-l-4 border-l-[#4F7DF6]' : ''}`}>
                <div className="flex items-center gap-4">
                  <span className={`text-sm font-extrabold ${u.name === user?.name ? 'text-[#4F7DF6]' : 'text-[#94A3B8]'} w-6`}>#{u.rank}</span>
                  <Avatar src={u.avatar} size="sm" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1E293B] truncate">{u.name} {u.name === user?.name && <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-black bg-[#4F7DF6] text-white rounded">You</span>}</h4>
                    <p className="text-[10px] text-[#94A3B8] truncate">{u.institution}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-amber-500 font-bold flex items-center gap-1"><Flame className="w-3.5 h-3.5 fill-current" /> {u.streak || 0}d</span>
                  <span className="text-xs font-extrabold text-[#4F7DF6]">{(u.xp || 0).toLocaleString()} XP</span>
                </div>
              </div>
            ))
          )}
        </Card>
      </div>
    </AppLayout>
  );
}