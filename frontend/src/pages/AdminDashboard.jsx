import { useState, useEffect } from 'react';
import {
  Users, GraduationCap, ShieldCheck, TrendingUp, AlertCircle, CheckCircle2,
  Briefcase, Plus, Pen, Trash2, X, Save, Megaphone, ClipboardList, FlaskConical
} from 'lucide-react';
import { userService, jobService, orderService } from '../services/api';

const TABS = [
  { id: 'users', label: 'User Directory', icon: Users },
  { id: 'drives', label: 'Drives / Jobs', icon: Briefcase },
  { id: 'sessions', label: 'Sessions & Announcements', icon: Megaphone },
  { id: 'tests', label: 'Test Management', icon: FlaskConical },
];

const emptyJob = {
  title: '', description: '', requirements: '', location: '',
  salary: '', minCgpa: '', maxBacklogs: '', bondDetails: '',
  deadline: '', allowedBranches: '',
};

const emptySession = { title: '', content: '', targetRole: 'STUDENT' };

export default function AdminDashboard() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Job modal state
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobForm, setJobForm] = useState(emptyJob);
  const [editingJobId, setEditingJobId] = useState(null);

  // Session form
  const [sessionForm, setSessionForm] = useState(emptySession);

  const currentUserRole = localStorage.getItem('userRole')?.toUpperCase() || '';
  const currentUserId = localStorage.getItem('userId');
  const isAdmin = currentUserRole === 'ADMIN';

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [u, j, o] = await Promise.all([
        userService.getAllUsers(),
        jobService.getAllJobs(),
        orderService.getAllOrders(),
      ]);
      setUsers(u || []);
      setJobs(j || []);
      setOrders(o || []);
    } catch (err) {
      setError('Failed to load dashboard data. Verify Admin privileges.');
    } finally {
      setLoading(false);
    }
  };

  const flash = (msg, isErr = false) => {
    if (isErr) setError(msg); else setSuccessMsg(msg);
    setTimeout(() => { setError(null); setSuccessMsg(''); }, 3500);
  };

  /* ---- User management ---- */
  const promoteUser = async (userId, newRole) => {
    try {
      await userService.updateRole(userId, newRole);
      flash(`User role updated to ${newRole}.`);
      loadAll();
    } catch { flash('Failed to update role.', true); }
  };

  /* ---- Job / Drive management ---- */
  const openJobModal = (job = null) => {
    if (job) {
      setJobForm({
        ...job,
        deadline: job.deadline ? job.deadline.substring(0, 10) : '',
        allowedBranches: job.allowedBranches?.join(', ') || '',
        company: undefined,
        createdAt: undefined,
      });
      setEditingJobId(job.id);
    } else {
      setJobForm(emptyJob);
      setEditingJobId(null);
    }
    setShowJobModal(true);
  };

  const saveJob = async () => {
    const payload = {
      ...jobForm,
      allowedBranches: jobForm.allowedBranches ? jobForm.allowedBranches.split(',').map(s => s.trim()) : [],
      minCgpa: jobForm.minCgpa ? parseFloat(jobForm.minCgpa) : null,
      maxBacklogs: jobForm.maxBacklogs ? parseInt(jobForm.maxBacklogs) : null,
      deadline: jobForm.deadline ? `${jobForm.deadline}T23:59:59` : null,
      company: { id: parseInt(currentUserId) },
    };
    try {
      if (editingJobId) {
        await jobService.updateJob(editingJobId, payload);
        flash('Drive updated successfully!');
      } else {
        await jobService.createJob(payload);
        flash('New drive posted successfully!');
      }
      setShowJobModal(false);
      loadAll();
    } catch (e) { flash(e.message || 'Failed to save drive.', true); }
  };

  const deleteJobConfirm = async (id) => {
    if (!window.confirm('Are you sure you want to delete this drive?')) return;
    try {
      await jobService.deleteJob(id);
      flash('Drive deleted.');
      loadAll();
    } catch { flash('Failed to delete drive.', true); }
  };

  /* ---- Sessions / Announcements ---- */
  const postSession = async (e) => {
    e.preventDefault();
    try {
      await orderService.createOrder({ ...sessionForm, senderId: currentUserId });
      flash('Session/Announcement posted!');
      setSessionForm(emptySession);
      loadAll();
    } catch { flash('Failed to post session.', true); }
  };

  /* -----  Test management state  ----- */
  const [testLink, setTestLink] = useState({ testName: '', testUrl: '', jobId: '' });
  const postTest = (e) => {
    e.preventDefault();
    // real implementation would use a backend endpoint; for now shows as session/order
    orderService.createOrder({
      title: `📝 Test: ${testLink.testName}`,
      content: `Please complete the assessment for the linked drive:\n${testLink.testUrl}`,
      targetRole: 'STUDENT',
      senderId: currentUserId,
    }).then(() => { flash('Test link sent to all students!'); setTestLink({ testName: '', testUrl: '', jobId: '' }); loadAll(); })
      .catch(() => flash('Failed to send test link.', true));
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fbfbfd] pt-24 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fbfbfd] pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-4">
            <ShieldCheck className="w-4 h-4" /> TPO / Coordinator Panel
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Admin Dashboard</h1>
          <p className="text-gray-500 font-light text-lg">Manage placements, drives, announcements, and more.</p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-2 text-sm font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />{error}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl text-green-700 flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />{successMsg}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Students', value: users.filter(u => u.role === 'STUDENT').length, icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Active Drives', value: jobs.length, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Announcements', value: orders.length, icon: Megaphone, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">{s.label}</p>
                <div className={`p-2 rounded-xl ${s.bg}`}><s.icon className={`w-4 h-4 ${s.color}`} /></div>
              </div>
              <p className="text-3xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-1 bg-gray-100/60 p-1 rounded-2xl w-fit flex-wrap">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === t.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <t.icon className="w-4 h-4" />{t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}

        {/* --- USER DIRECTORY --- */}
        {tab === 'users' && isAdmin && (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold tracking-tight mb-1">User Directory</h2>
            <p className="text-gray-500 text-sm mb-6">Elevate students to Coordinators or revoke access.</p>
            <div className="overflow-x-auto ring-1 ring-gray-100 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Name', 'Email', 'Role', 'Actions'].map(h => (
                      <th key={h} className={`py-4 px-6 text-sm font-semibold text-gray-900 ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-400">Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{user.email}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${
                          user.role === 'ADMIN' ? 'bg-red-50 text-red-700 border-red-200' :
                          user.role === 'COORDINATOR' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                          user.role === 'COMPANY' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          'bg-gray-50 text-gray-700 border-gray-200'
                        }`}>{user.role}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {user.role === 'STUDENT' && (
                          <button onClick={() => promoteUser(user.id, 'COORDINATOR')} className="text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors">
                            Make Coordinator
                          </button>
                        )}
                        {user.role === 'COORDINATOR' && (
                          <button onClick={() => promoteUser(user.id, 'STUDENT')} className="text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors ml-2">
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && <tr><td colSpan="4" className="py-12 text-center text-gray-400">No users found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- DRIVES / JOB MANAGEMENT --- */}
        {tab === 'drives' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-1">Placement Drives</h2>
                <p className="text-gray-500 text-sm">Create, edit, and delete placement drives.</p>
              </div>
              <button
                onClick={() => openJobModal()}
                className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" /> New Drive
              </button>
            </div>
            <div className="overflow-x-auto ring-1 ring-gray-100 rounded-2xl">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Title', 'Location', 'Salary', 'Deadline', 'Actions'].map(h => (
                      <th key={h} className={`py-4 px-6 text-sm font-semibold text-gray-900 text-left ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {jobs.map(job => (
                    <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-semibold">{job.title}</td>
                      <td className="py-4 px-6 text-sm text-gray-500">{job.location || '—'}</td>
                      <td className="py-4 px-6 text-sm text-gray-500">{job.salary || '—'}</td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {job.deadline ? new Date(job.deadline).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button onClick={() => openJobModal(job)} className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors inline-flex items-center gap-1">
                          <Pen className="w-3 h-3" /> Edit
                        </button>
                        <button onClick={() => deleteJobConfirm(job.id)} className="text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors inline-flex items-center gap-1">
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {jobs.length === 0 && <tr><td colSpan="5" className="py-12 text-center text-gray-400">No drives yet. Click "New Drive" to post one.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- SESSIONS & ANNOUNCEMENTS --- */}
        {tab === 'sessions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-1">Post Session / Announcement</h2>
              <p className="text-gray-500 text-sm mb-5">Broadcast an announcement to specific user groups.</p>
              <form onSubmit={postSession} className="space-y-4">
                <input type="text" required placeholder="Title (e.g., Resume Writing Workshop)" value={sessionForm.title}
                  onChange={e => setSessionForm({ ...sessionForm, title: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                <select value={sessionForm.targetRole} onChange={e => setSessionForm({ ...sessionForm, targetRole: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  <option value="STUDENT">All Students</option>
                  <option value="COORDINATOR">Coordinators Only</option>
                  <option value="COMPANY">Registered Companies</option>
                </select>
                <textarea required rows={4} placeholder="Write the complete announcement here..." value={sessionForm.content}
                  onChange={e => setSessionForm({ ...sessionForm, content: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors">
                  📣 Broadcast Now
                </button>
              </form>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-y-auto max-h-[600px]">
              <h2 className="text-xl font-bold mb-4">Previous Announcements ({orders.length})</h2>
              {orders.length === 0 ? (
                <p className="text-gray-400 text-sm">No announcements yet.</p>
              ) : (
                <ul className="space-y-4">
                  {orders.map(o => (
                    <li key={o.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-sm text-gray-900">{o.title}</h4>
                        <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">{o.targetRole}</span>
                      </div>
                      <p className="text-xs text-gray-500 whitespace-pre-wrap">{o.content}</p>
                      <p className="text-[10px] text-gray-400 mt-2">{new Date(o.timestamp).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* --- TEST MANAGEMENT --- */}
        {tab === 'tests' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-1">Schedule Assessment / Test</h2>
              <p className="text-gray-500 text-sm mb-5">Share a test link or assessment date with all students.</p>
              <form onSubmit={postTest} className="space-y-4">
                <input type="text" required placeholder="Test / Assessment Name" value={testLink.testName}
                  onChange={e => setTestLink({ ...testLink, testName: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                <select value={testLink.jobId} onChange={e => setTestLink({ ...testLink, jobId: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  <option value="">— Link to a Drive (Optional) —</option>
                  {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                </select>
                <input type="url" required placeholder="Test Link / Platform URL" value={testLink.testUrl}
                  onChange={e => setTestLink({ ...testLink, testUrl: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors">
                  🧪 Send to All Students
                </button>
              </form>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">Active Drives Pipeline</h2>
              {jobs.length === 0 ? <p className="text-gray-400 text-sm">Post a drive first to assign tests.</p> : (
                <ul className="space-y-3">
                  {jobs.map(j => (
                    <li key={j.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <div>
                        <p className="font-semibold text-sm">{j.title}</p>
                        <p className="text-xs text-gray-400">{j.location || 'No location set'}</p>
                      </div>
                      <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-medium">
                        {j.deadline ? `Due ${new Date(j.deadline).toLocaleDateString()}` : 'No deadline'}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold">{editingJobId ? 'Edit Drive' : 'Post New Drive'}</h3>
              <button onClick={() => setShowJobModal(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Job Title *', key: 'title', placeholder: 'e.g., Software Engineer' },
                { label: 'Location', key: 'location', placeholder: 'e.g., Bangalore, Remote' },
                { label: 'Package / Salary', key: 'salary', placeholder: 'e.g., 6 LPA' },
                { label: 'Min CGPA', key: 'minCgpa', placeholder: 'e.g., 7.5' },
                { label: 'Max Backlogs Allowed', key: 'maxBacklogs', placeholder: 'e.g., 0' },
                { label: 'Application Deadline', key: 'deadline', placeholder: '', type: 'date' },
                { label: 'Allowed Branches (comma-separated)', key: 'allowedBranches', placeholder: 'CS, IT, ECE', colSpan: true },
                { label: 'Bond Details', key: 'bondDetails', placeholder: 'e.g., 2-year bond', colSpan: true },
              ].map(f => (
                <div key={f.key} className={f.colSpan ? 'md:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  <input
                    type={f.type || 'text'}
                    placeholder={f.placeholder}
                    value={jobForm[f.key] || ''}
                    onChange={e => setJobForm({ ...jobForm, [f.key]: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                <textarea rows={3} placeholder="Describe the role, responsibilities..." value={jobForm.description || ''}
                  onChange={e => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements / Eligibility</label>
                <textarea rows={3} placeholder="List required qualifications..." value={jobForm.requirements || ''}
                  onChange={e => setJobForm({ ...jobForm, requirements: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowJobModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={saveJob} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
                <Save className="w-4 h-4" /> {editingJobId ? 'Update Drive' : 'Post Drive'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
