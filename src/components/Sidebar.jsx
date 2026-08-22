import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Video,
  PlusCircle,
  Users,
  Shield,
  FolderTree,
  BarChart3,
  Settings,
  ArrowLeft
} from 'lucide-react';

export const Sidebar = ({ type = 'student' }) => {
  const { user } = useAuth();

  const studentLinks = [
    { name: 'My Learning', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Browse Courses', to: '/courses', icon: BookOpen },
    { name: 'Certificates', to: '/certificates', icon: Award },
    { name: 'Profile Settings', to: '/profile', icon: Settings }
  ];

  const instructorLinks = [
    { name: 'Dashboard Overview', to: '/instructor/dashboard', icon: BarChart3 },
    { name: 'Manage Courses', to: '/instructor/courses', icon: Video },
    { name: 'Create New Course', to: '/instructor/courses/create', icon: PlusCircle },
    { name: 'Profile Settings', to: '/profile', icon: Settings }
  ];

  const adminLinks = [
    { name: 'Admin Overview', to: '/admin/dashboard', icon: Shield },
    { name: 'User Management', to: '/admin/users', icon: Users },
    { name: 'Course Moderation', to: '/admin/courses', icon: BookOpen },
    { name: 'Categories', to: '/admin/categories', icon: FolderTree }
  ];

  const links = type === 'instructor' ? instructorLinks : type === 'admin' ? adminLinks : studentLinks;

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800/80 min-h-[calc(100vh-5rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-3">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150'}
            alt={user?.name}
            className="w-10 h-10 rounded-full object-cover border border-indigo-500/50"
          />
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-white truncate">{user?.name}</h4>
            <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
              {type.toUpperCase()} PORTAL
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1.5">
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Menu Navigation
          </p>
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard' || item.to === '/instructor/dashboard' || item.to === '/admin/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-glow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Footer link to public site */}
      <div className="pt-4 border-t border-slate-800">
        <NavLink
          to="/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Site</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
