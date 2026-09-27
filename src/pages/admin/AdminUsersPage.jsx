import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Users, Search, Trash2, Shield, Calendar, Award, Flame, RefreshCw } from 'lucide-react';
import { apiGet, apiDelete } from '../../config/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiGet('/admin/users');
      if (data && data.success && data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.warn('Error fetching users:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete student account "${name}"?`)) return;
    setDeletingId(id);
    try {
      await apiDelete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setMessage(`Student "${name}" deleted successfully.`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Failed to delete user: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.username?.toLowerCase().includes(term)
    );
  });

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase">
                Separate Field
              </span>
              <h1 className="text-2xl font-black text-white">Student Users Management</h1>
              <p className="text-xs text-slate-400">List of all registered student accounts on StudyVerse</p>
            </div>
          </div>

          <button
            onClick={fetchUsers}
            className="self-start sm:self-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {message && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-200 text-xs font-bold">
            {message}
          </div>
        )}

        {/* Filter / Search Bar */}
        <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
          <Search className="w-4 h-4 text-slate-500 ml-2" />
          <input
            type="text"
            placeholder="Search students by name, email or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <span className="text-xs font-bold text-slate-400 px-3 py-1 bg-slate-950 rounded-lg border border-slate-800">
            {filteredUsers.length} Students
          </span>
        </div>

        {/* Users Table */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs font-bold">Loading student records...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Users className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-white">No student accounts found</p>
              <p className="text-xs text-slate-500">Students registering through the app will populate here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-black text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Student</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Institution</th>
                    <th className="p-4">XP &amp; Streak</th>
                    <th className="p-4">Joined</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                            alt={u.name}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                          />
                          <div>
                            <p className="font-bold text-white">{u.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{u.username || `@${u.name.toLowerCase().replace(/\s+/g, '')}`}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-slate-400">{u.email}</td>
                      <td className="p-4 text-slate-300">{u.institution || 'Stanford University'}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold text-[10px]">
                            <Award className="w-3 h-3" /> {u.xp || 0} XP
                          </span>
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 font-bold text-[10px]">
                            <Flame className="w-3 h-3" /> {u.streak || 0}d
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          disabled={deletingId === u._id}
                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 border border-rose-800/40 text-rose-400 hover:text-white transition-all cursor-pointer"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
