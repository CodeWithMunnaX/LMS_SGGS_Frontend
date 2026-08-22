import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, User, Sparkles, ArrowRight, Loader2, Video, BookOpen } from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [headline, setHeadline] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        role,
        headline: headline || (role === 'instructor' ? 'Course Instructor' : 'Passionate Learner')
      });
      if (role === 'instructor') {
        navigate('/instructor/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      // Handled by AuthContext toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 blur-[120px] -z-10 rounded-full pointer-events-none" />

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-glow">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Create Your Account
          </h2>
          <p className="text-xs text-slate-400">
            Join thousands of students and instructors worldwide
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl space-y-6 shadow-2xl">
          {/* Role Choice Pills */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">I want to:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  role === 'student'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-glow'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Learn (Student)</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('instructor')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  role === 'instructor'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-glow'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Teach (Instructor)</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

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
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              <span>Create Account</span>
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-indigo-400 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
