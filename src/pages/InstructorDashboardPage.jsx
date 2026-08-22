import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BarChart3,
  DollarSign,
  Users,
  Video,
  Star,
  PlusCircle,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Sparkles,
  Loader2
} from 'lucide-react';
import courseService from '../services/courseService';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';

export const InstructorDashboardPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ totalCourses: 0, totalStudents: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstructorData();
  }, []);

  const fetchInstructorData = async () => {
    setLoading(true);
    try {
      const data = await courseService.getInstructorCourses();
      setCourses(data.courses || []);
      setStats(data.stats || { totalCourses: 0, totalStudents: 0, totalRevenue: 0 });
    } catch (error) {
      console.error('Failed to load instructor stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)]">
      <Sidebar type="instructor" />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Instructor Studio 🚀
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Overview of course analytics, student enrollments, and teaching revenue.
            </p>
          </div>

          <Link
            to="/instructor/courses/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-glow transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Course</span>
          </Link>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">
              ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Students</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {stats.totalStudents.toLocaleString()}
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Courses</span>
              <Video className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-purple-400">
              {stats.totalCourses}
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Instructor Status</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-sm font-black text-amber-400 flex items-center gap-1.5 pt-1">
              <span>Verified Educator</span>
            </div>
          </div>
        </div>

        {/* Quick Links / Recent Courses Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">My Published & Draft Courses</h2>
            <Link
              to="/instructor/courses"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="glass-panel rounded-2xl p-8 animate-pulse bg-slate-800/40 h-48" />
          ) : courses.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
              <Video className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No courses created yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Start sharing your expertise by building your first video curriculum today.
              </p>
              <Link
                to="/instructor/courses/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-glow"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Your First Course</span>
              </Link>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/60 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-3.5">Course</th>
                      <th className="px-6 py-3.5">Category</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5">Price</th>
                      <th className="px-6 py-3.5">Students</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {courses.slice(0, 5).map((course) => (
                      <tr key={course._id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img
                            src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=150'}
                            alt={course.title}
                            className="w-10 h-8 rounded-lg object-cover bg-slate-900 shrink-0"
                          />
                          <span className="font-bold text-white truncate max-w-xs">{course.title}</span>
                        </td>
                        <td className="px-6 py-4">{course.category}</td>
                        <td className="px-6 py-4">
                          <Badge variant={course.status === 'published' ? 'emerald' : 'slate'} size="sm">
                            {course.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 font-semibold text-white">
                          {course.price === 0 ? 'Free' : `$${course.price}`}
                        </td>
                        <td className="px-6 py-4">{course.enrolledStudentsCount || 0}</td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/instructor/courses/edit/${course._id}`}
                            className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
                          >
                            Edit Curriculum
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InstructorDashboardPage;
