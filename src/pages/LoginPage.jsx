import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, Zap, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import Badge from '../components/Badge';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, demoLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      // Error handled by AuthContext toast
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (role) => {
    setDemoLoading(true);
    try {
      await demoLogin(role);
      if (role === 'instructor') {
        navigate('/instructor/dashboard', { replace: true });
      } else if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      // Error handled by AuthContext toast
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 blur-[120px] -z-10 rounded-full pointer-events-none" />

      <div className="w-full max-w-md space-y-6">
        {/* Logo Card */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-glow">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-400">
            Sign in to continue your learning journey
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="glass-panel p-4 rounded-2xl border border-indigo-500/20 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              1-Click Demo Login
            </span>
            <span className="text-[10px] text-slate-400 lowercase">(Instant Access)</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={demoLoading || loading}
              onClick={() => handleDemoClick('student')}
              className="py-2 px-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all text-center"
            >
              🎓 Student
            </button>
            <button
              type="button"
              disabled={demoLoading || loading}
              onClick={() => handleDemoClick('instructor')}
              className="py-2 px-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold transition-all text-center"
            >
              👨‍🏫 Instructor
            </button>
            <button
              type="button"
              disabled={demoLoading || loading}
              onClick={() => handleDemoClick('admin')}
              className="py-2 px-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold transition-all text-center"
            >
              👑 Admin
            </button>
          </div>
        </div>

        {/* Traditional Auth Card */}
        <div className="glass-panel p-8 rounded-3xl space-y-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-300">Password</label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || demoLoading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              <span>Sign In</span>
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-indigo-400 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
