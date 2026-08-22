import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Search,
  BookOpen,
  LayoutDashboard,
  Award,
  Video,
  PlusCircle,
  Shield,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Zap
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isDemoDropdownOpen, setIsDemoDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const demoRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
      if (demoRef.current && !demoRef.current.contains(event.target)) {
        setIsDemoDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleDemoSwitch = async (role) => {
    setIsDemoDropdownOpen(false);
    await demoLogin(role);
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-300">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                  Learn<span className="text-indigo-400">Pulse</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    LMS
                  </span>
                </span>
              </div>
            </Link>

            {/* Explore Link */}
            <Link
              to="/courses"
              className={`hidden md:flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                location.pathname === '/courses'
                  ? 'text-indigo-400 bg-indigo-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Courses</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-2">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="What do you want to learn today?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-700/70 rounded-full text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher */}
            <div className="relative" ref={demoRef}>
              <button
                type="button"
                onClick={() => setIsDemoDropdownOpen(!isDemoDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all shadow-sm"
                title="Switch demo role instantly"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="hidden sm:inline">Demo Switcher</span>
                <ChevronDown className="w-3 h-3 text-indigo-400" />
              </button>

              {isDemoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-scaleUp">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    Switch Active Persona
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('student')}
                    className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-indigo-600/20 hover:text-indigo-300 flex items-center gap-2.5"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>🎓 Student (Alex)</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('instructor')}
                    className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-indigo-600/20 hover:text-indigo-300 flex items-center gap-2.5"
                  >
                    <div className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span>👨‍🏫 Instructor (Angela)</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('admin')}
                    className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-indigo-600/20 hover:text-indigo-300 flex items-center gap-2.5"
                  >
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>👑 Administrator</span>
                  </button>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <>
                {/* Role Specific Quick Action */}
                {user?.role === 'instructor' && (
                  <Link
                    to="/instructor/courses/create"
                    className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-glow transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create Course</span>
                  </Link>
                )}

                {/* User Avatar & Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-2.5 p-1 rounded-full hover:ring-2 hover:ring-indigo-500/50 transition-all focus:outline-none"
                  >
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150'}
                      alt={user?.name}
                      className="w-9 h-9 rounded-full object-cover border border-indigo-500/40"
                    />
                    <div className="hidden md:flex flex-col text-left">
                      <span className="text-xs font-bold text-white leading-tight">
                        {user?.name}
                      </span>
                      <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
                        {user?.role}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
                  </button>

                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl py-2 z-50 animate-scaleUp">
                      {/* User Header */}
                      <div className="px-4 py-3 border-b border-slate-800">
                        <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                          {user?.role} Account
                        </span>
                      </div>

                      <div className="py-1">
                        {/* Student links */}
                        <Link
                          to="/dashboard"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                          <span>My Learning</span>
                        </Link>
                        <Link
                          to="/certificates"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                          <Award className="w-4 h-4 text-amber-400" />
                          <span>My Certificates</span>
                        </Link>

                        {/* Instructor links */}
                        {(user?.role === 'instructor' || user?.role === 'admin') && (
                          <>
                            <div className="my-1 border-t border-slate-800" />
                            <Link
                              to="/instructor/dashboard"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-indigo-300 hover:bg-indigo-500/10 transition-colors"
                            >
                              <Video className="w-4 h-4 text-indigo-400" />
                              <span>Instructor Studio</span>
                            </Link>
                          </>
                        )}

                        {/* Admin links */}
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-purple-300 hover:bg-purple-500/10 transition-colors"
                          >
                            <Shield className="w-4 h-4 text-purple-400" />
                            <span>Admin Center</span>
                          </Link>
                        )}

                        <div className="my-1 border-t border-slate-800" />
                        <Link
                          to="/profile"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>Profile Settings</span>
                        </Link>

                        <button
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4 text-rose-400" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-glow transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 md:hidden"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0B0F19] px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="space-y-1 pt-2">
            <Link
              to="/courses"
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-200 hover:bg-slate-800"
            >
              Explore Courses
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-200 hover:bg-slate-800"
                >
                  My Learning
                </Link>
                <Link
                  to="/certificates"
                  className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-200 hover:bg-slate-800"
                >
                  Certificates
                </Link>
                {(user?.role === 'instructor' || user?.role === 'admin') && (
                  <Link
                    to="/instructor/dashboard"
                    className="block px-3 py-2 rounded-lg text-base font-semibold text-indigo-400 hover:bg-slate-800"
                  >
                    Instructor Studio
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="block px-3 py-2 rounded-lg text-base font-semibold text-purple-400 hover:bg-slate-800"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 rounded-lg text-base font-semibold text-rose-400 hover:bg-rose-500/10"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  className="w-full py-2.5 text-center rounded-xl bg-slate-800 text-sm font-bold text-white"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="w-full py-2.5 text-center rounded-xl bg-indigo-600 text-sm font-bold text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
