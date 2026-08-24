import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { GraduationCap, Search, Trash2, CheckCircle2, ShieldAlert, Building, RefreshCw, AlertCircle } from 'lucide-react';
import { apiGet, apiDelete } from '../../config/api';

export default function AdminFacultyPage() {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const data = await apiGet('/admin/faculty');
      if (data && data.success && data.faculty) {
        setFacultyList(data.faculty);
      }
    } catch (err) {
      console.warn('Error fetching faculty:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleDeleteFaculty = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete faculty account "${name}"?`)) return;
    setDeletingId(id);
    try {
      await apiDelete(`/admin/faculty/${id}`);
      setFacultyList((prev) => prev.filter((f) => f._id !== id));
      setMessage(`Faculty member "${name}" deleted.`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Failed to delete faculty: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handlePurgeAll = async () => {
    if (!window.confirm('Wipe ALL faculty accounts from database? Only validated @faculty.studyverse.com accounts will remain.')) return;
    setLoading(true);
    try {
      const data = await apiDelete('/admin/faculty-cleanup');
      setMessage(data.message || 'All faculty accounts wiped.');
      fetchFaculty();
    } catch (err) {
      alert('Purge failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredFaculty = facultyList.filter((f) => {
    const term = searchTerm.toLowerCase();
    return (
      f.name?.toLowerCase().includes(term) ||
      f.email?.toLowerCase().includes(term) ||
      f.department?.toLowerCase().includes(term) ||
      f.institution?.toLowerCase().includes(term)
    );
  });

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase">
                Separate Field
              </span>
              <h1 className="text-2xl font-black text-white">Faculty &amp; Tutors Management</h1>
              <p className="text-xs text-slate-400">Validated @faculty.studyverse.com educators and course instructors</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchFaculty}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button
              onClick={handlePurgeAll}
              className="px-3 py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" /> Purge All Faculty
            </button>
          </div>
        </div>

        {/* Validation Notice Banner */}
        <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
          <div>
            <span className="font-bold text-white">Faculty Email Requirement:</span> Accounts must use an official{' '}
            <code className="bg-slate-950 text-indigo-300 px-1.5 py-0.5 rounded font-mono font-bold">@faculty.studyverse.com</code> email. Accounts violating this domain are flagged.
          </div>
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
            placeholder="Search faculty by name, email, department or university..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <span className="text-xs font-bold text-slate-400 px-3 py-1 bg-slate-950 rounded-lg border border-slate-800">
            {filteredFaculty.length} Faculty
          </span>
        </div>

        {/* Faculty Table */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs font-bold">Loading faculty records...</div>
          ) : filteredFaculty.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <GraduationCap className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-white">No faculty accounts found in database</p>
              <p className="text-xs text-slate-500">Faculty signing up with @faculty.studyverse.com will appear in this separate field.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-black text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Faculty Member</th>
                    <th className="p-4">Email &amp; Domain Status</th>
                    <th className="p-4">Department &amp; Title</th>
                    <th className="p-4">Institution</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredFaculty.map((f) => {
                    const isDomainValid = f.email?.toLowerCase().endsWith('@faculty.studyverse.com');
                    return (
                      <tr key={f._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={f.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?auto=format&fit=crop&w=400&q=80'}
                              alt={f.name}
                              className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                            />
                            <div>
                              <p className="font-bold text-white flex items-center gap-1.5">
                                {f.name}
                                {f.isVerified && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-extrabold">
                                    ✓ Verified
                                  </span>
                                )}
                              </p>
                              <p className="text-[10px] text-slate-500 font-mono">{f.username || `@${f.name.toLowerCase().replace(/\s+/g, '')}`}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono">
                          <p className="text-slate-300 font-bold">{f.email}</p>
                          {isDomainValid ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                              ✓ Verified Domain (@faculty.studyverse.com)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 font-bold">
                              ⚠️ Non-Faculty Domain
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-white">{f.department || 'Computer Science & AI'}</p>
                          <p className="text-[10px] text-slate-400">{f.title || 'Faculty / Lead Instructor'}</p>
                        </td>
                        <td className="p-4 text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <Building className="w-3.5 h-3.5 text-slate-500" />
                            <span>{f.institution || 'Stanford University'}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold text-[10px]">
                            {f.role?.toUpperCase() || 'FACULTY'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteFaculty(f._id, f.name)}
                            disabled={deletingId === f._id}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 border border-rose-800/40 text-rose-400 hover:text-white transition-all cursor-pointer"
                            title="Delete Faculty Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
