import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  PlayCircle,
  ArrowRight,
  Loader2,
  Sparkles
} from 'lucide-react';
import enrollmentService from '../services/enrollmentService';
import Sidebar from '../components/Sidebar';
import ProgressBar from '../components/ProgressBar';
import Badge from '../components/Badge';

export const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState({ totalEnrolled: 0, completedCourses: 0, inProgressCourses: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyEnrollments();
  }, []);

  const fetchMyEnrollments = async () => {
    setLoading(true);
    try {
      const data = await enrollmentService.getMyEnrollments();
      setEnrollments(data.enrollments || []);
      setStats(data.stats || { totalEnrolled: 0, completedCourses: 0, inProgressCourses: 0 });
    } catch (error) {
      console.error('Failed to load student enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)]">
      {/* Sidebar Navigation */}
      <Sidebar type="student" />

      {/* Main Content Dashboard */}
      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto max-w-6xl">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Continue where you left off and keep building your skillset.
            </p>
          </div>

          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-glow transition-all self-start sm:self-auto"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse New Courses</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Enrolled Courses</p>
            <div className="text-2xl sm:text-3xl font-black text-white">{stats.totalEnrolled}</div>
          </div>
          <div className="glass-panel p-5 rounded-2xl space-y-1">
            <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">In Progress</p>
            <div className="text-2xl sm:text-3xl font-black text-indigo-400">{stats.inProgressCourses}</div>
          </div>
          <div className="glass-panel p-5 rounded-2xl space-y-1">
            <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Completed</p>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">{stats.completedCourses}</div>
          </div>
          <div className="glass-panel p-5 rounded-2xl space-y-1">
            <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Certificates</p>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">{stats.completedCourses}</div>
          </div>
        </div>

        {/* Courses in Progress / My Learning */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              My Learning Track
            </h2>
            <span className="text-xs text-slate-400">
              {enrollments.length} Active Courses
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="glass-card rounded-2xl h-64 animate-pulse bg-slate-800/40" />
              ))}
            </div>
          ) : enrollments.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">You haven't enrolled in any courses yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Discover hands-on courses in Web Development, AI, UI/UX, and Cloud Computing.
              </p>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-glow"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enr) => {
                const c = enr.course;
                if (!c) return null;

                return (
                  <div
                    key={enr._id}
                    className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group transition-all"
                  >
                    <div className="relative aspect-video bg-black overflow-hidden">
                      <img
                        src={c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800'}
                        alt={c.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        {enr.isCompleted ? (
                          <Badge variant="emerald" size="sm">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>COMPLETED</span>
                          </Badge>
                        ) : (
                          <Badge variant="indigo" size="sm">
                            IN PROGRESS
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                          {c.category}
                        </span>
                        <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                          {c.title}
                        </h3>
                        {c.instructor && (
                          <p className="text-xs text-slate-400">By {c.instructor.name}</p>
                        )}
                      </div>

                      <div className="space-y-3 pt-2 border-t border-slate-800/80">
                        <ProgressBar progress={enr.progressPercentage || 0} />
                        <Link
                          to={`/learn/${c._id}`}
                          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-glow flex items-center justify-center gap-2"
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>{enr.isCompleted ? 'Review Classroom' : 'Continue Lesson'}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboardPage;
