import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Users,
  BookOpen,
  DollarSign,
  Award,
  FolderTree,
  UserCheck,
  UserX,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  Sparkles,
  Loader2,
  TrendingUp
} from 'lucide-react';
import adminService from '../services/adminService';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

export const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Stats
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentEnrollments, setRecentEnrollments] = useState([]);

  // Users Tab
  const [usersList, setUsersList] = useState([]);
  const [userKeyword, setUserKeyword] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  // Courses Tab
  const [coursesList, setCoursesList] = useState([]);

  // Categories Tab
  const [categoriesList, setCategoriesList] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'courses') fetchCourses();
    if (activeTab === 'categories') fetchCategories();
  }, [activeTab]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await adminService.getPlatformStats();
      setStats(data.stats);
      setRecentUsers(data.recentUsers || []);
      setRecentEnrollments(data.recentEnrollments || []);
    } catch (error) {
      console.error('Failed to load admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await adminService.getAllUsers({
        keyword: userKeyword || undefined,
        role: userRoleFilter !== 'all' ? userRoleFilter : undefined
      });
      setUsersList(data.users || []);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const fetchCourses = async () => {
    try {
      const data = await adminService.getAllCoursesAdmin();
      setCoursesList(data.courses || []);
    } catch (error) {
      toast.error('Failed to load courses for admin');
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await adminService.getCategories();
      setCategoriesList(data.categories || []);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      setUsersList((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      toast.success(`Role changed to ${newRole}`);
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      const res = await adminService.toggleUserStatus(userId);
      setUsersList((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isActive: res.isActive } : u))
      );
      toast.success(`User status updated`);
    } catch (error) {
      toast.error('Failed to toggle status');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      const res = await adminService.createCategory({
        name: newCatName.trim(),
        description: newCatDesc.trim()
      });
      setCategoriesList([...categoriesList, res.category]);
      setNewCatName('');
      setNewCatDesc('');
      toast.success('Category created');
    } catch (error) {
      toast.error('Failed to create category');
    }
  };

  const handleDeleteCategory = async (catId) => {
    try {
      await adminService.deleteCategory(catId);
      setCategoriesList((prev) => prev.filter((c) => c._id !== catId));
      toast.success('Category deleted');
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)]">
      <Sidebar type="admin" />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto max-w-6xl">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="purple" size="sm">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>ADMINISTRATION CENTER</span>
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-1">
            Platform Operations & Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            System metrics, user role governance, curriculum moderation, and taxonomy.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="border-b border-slate-800 flex items-center gap-6 text-xs font-bold">
          {[
            { id: 'overview', name: 'Platform Metrics', icon: TrendingUp },
            { id: 'users', name: 'User Management', icon: Users },
            { id: 'courses', name: 'All Courses', icon: BookOpen },
            { id: 'categories', name: 'Categories', icon: FolderTree }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Platform Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-panel p-5 rounded-2xl space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Platform Users</span>
                <div className="text-2xl sm:text-3xl font-black text-white">{stats?.users?.total || 0}</div>
                <p className="text-[10px] text-slate-500 font-semibold">
                  {stats?.users?.students || 0} Students • {stats?.users?.instructors || 0} Instructors
                </p>
              </div>

              <div className="glass-panel p-5 rounded-2xl space-y-1">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Total Courses</span>
                <div className="text-2xl sm:text-3xl font-black text-indigo-400">{stats?.courses?.total || 0}</div>
                <p className="text-[10px] text-slate-500 font-semibold">
                  {stats?.courses?.published || 0} Published • {stats?.courses?.draft || 0} Drafts
                </p>
              </div>

              <div className="glass-panel p-5 rounded-2xl space-y-1">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Total Enrollments</span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">{stats?.enrollments?.total || 0}</div>
                <p className="text-[10px] text-slate-500 font-semibold">
                  {stats?.enrollments?.completed || 0} Course Completions
                </p>
              </div>

              <div className="glass-panel p-5 rounded-2xl space-y-1">
                <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Platform Revenue</span>
                <div className="text-2xl sm:text-3xl font-black text-purple-400">
                  ${(stats?.revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-[10px] text-slate-500 font-semibold">Total course sales volume</p>
              </div>
            </div>

            {/* Recent Feeds */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white">Recent User Signups</h3>
                <div className="divide-y divide-slate-800/80">
                  {recentUsers.map((u) => (
                    <div key={u._id} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100'}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-white">{u.name}</p>
                          <p className="text-[11px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                      <Badge variant={u.role === 'admin' ? 'purple' : u.role === 'instructor' ? 'indigo' : 'slate'} size="sm">
                        {u.role.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Enrollments */}
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white">Recent Enrollments</h3>
                <div className="divide-y divide-slate-800/80">
                  {recentEnrollments.map((enr) => (
                    <div key={enr._id} className="py-3 flex items-center justify-between text-xs">
                      <div className="space-y-0.5 max-w-xs">
                        <p className="font-bold text-white truncate">{enr.course?.title}</p>
                        <p className="text-[11px] text-slate-400">Student: {enr.student?.name}</p>
                      </div>
                      <span className="font-semibold text-emerald-400">
                        {enr.course?.price === 0 ? 'Free' : `$${enr.course?.price}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: User Moderation */}
        {activeTab === 'users' && (
          <div className="glass-panel p-6 rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search user by name or email..."
                  value={userKeyword}
                  onChange={(e) => setUserKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Filter Role:</span>
                <select
                  value={userRoleFilter}
                  onChange={(e) => {
                    setUserRoleFilter(e.target.value);
                  }}
                  className="bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 px-3 py-2"
                >
                  <option value="all">All Roles</option>
                  <option value="student">Students</option>
                  <option value="instructor">Instructors</option>
                  <option value="admin">Administrators</option>
                </select>
                <button
                  onClick={fetchUsers}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {usersList.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-800/30">
                      <td className="px-4 py-3.5 flex items-center gap-3">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100'}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-bold text-white">{u.name}</span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-400">{u.email}</td>
                      <td className="px-4 py-3.5">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded-lg text-xs text-indigo-300 font-bold px-2 py-1"
                        >
                          <option value="student">Student</option>
                          <option value="instructor">Instructor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant={u.isActive ? 'emerald' : 'rose'} size="sm">
                          {u.isActive ? 'ACTIVE' : 'SUSPENDED'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => handleToggleUserStatus(u._id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold ${
                            u.isActive
                              ? 'bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                          }`}
                        >
                          {u.isActive ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Course Moderation */}
        {activeTab === 'courses' && (
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-white">All Platform Courses</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Instructor</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Students</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {coursesList.map((course) => (
                    <tr key={course._id} className="hover:bg-slate-800/30">
                      <td className="px-4 py-3.5 font-bold text-white truncate max-w-xs">{course.title}</td>
                      <td className="px-4 py-3.5 text-slate-300">{course.instructor?.name || 'Instructor'}</td>
                      <td className="px-4 py-3.5 text-indigo-400">{course.category}</td>
                      <td className="px-4 py-3.5">
                        <Badge variant={course.status === 'published' ? 'emerald' : 'slate'} size="sm">
                          {course.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-white">
                        {course.price === 0 ? 'Free' : `$${course.price}`}
                      </td>
                      <td className="px-4 py-3.5">{course.enrolledStudentsCount || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Categories Manager */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Category Form */}
            <form onSubmit={handleCreateCategory} className="glass-panel p-6 rounded-3xl space-y-4 h-fit">
              <h3 className="text-sm font-bold text-white">Add New Category</h3>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief summary..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-glow flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Category</span>
              </button>
            </form>

            {/* Categories List */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold text-white">Active Categories ({categoriesList.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categoriesList.map((cat) => (
                  <div
                    key={cat._id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">{cat.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate max-w-xs">{cat.description || cat.slug}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="p-1.5 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
