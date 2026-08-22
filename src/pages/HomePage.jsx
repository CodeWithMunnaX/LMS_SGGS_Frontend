import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  Play,
  Star,
  Users,
  Award,
  Video,
  Code2,
  Brain,
  Palette,
  Smartphone,
  Cloud,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import courseService from '../services/courseService';
import CourseCard from '../components/CourseCard';
import Badge from '../components/Badge';

export const HomePage = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await courseService.getFeaturedCourses();
        setFeaturedCourses(data.courses || []);
      } catch (error) {
        console.error('Failed to load featured courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: 'Web Development', icon: Code2, count: '24+ Courses', color: 'from-blue-500/20 to-indigo-500/20 text-indigo-400 border-indigo-500/30' },
    { name: 'Data Science & AI', icon: Brain, count: '18+ Courses', color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30' },
    { name: 'UI/UX Design', icon: Palette, count: '14+ Courses', color: 'from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30' },
    { name: 'Mobile App Development', icon: Smartphone, count: '12+ Courses', color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30' },
    { name: 'Cloud & DevOps', icon: Cloud, count: '16+ Courses', color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30' },
    { name: 'Cybersecurity', icon: ShieldCheck, count: '10+ Courses', color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30' },
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Glow Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/30 via-purple-600/20 to-pink-600/20 blur-[130px] -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider animate-fadeIn">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Next-Generation LMS Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
              Elevate Your Skills With{' '}
              <span className="gradient-text">World-Class</span> Learning
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Experience ultra-crisp Cloudinary video streaming, structured interactive curriculum, real-time progress tracking, and verifiable certificates from top industry practitioners.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/courses"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-glow transition-all flex items-center justify-center gap-2 group"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Join as Student / Instructor</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs font-semibold text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>HD Video Streaming</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Certificates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Interactive Video Player</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="glass-panel p-6 rounded-2xl text-center space-y-2">
            <div className="text-3xl sm:text-4xl font-black text-white">45,000+</div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Learners</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl text-center space-y-2">
            <div className="text-3xl sm:text-4xl font-black text-indigo-400">120+</div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Master Courses</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl text-center space-y-2">
            <div className="text-3xl sm:text-4xl font-black text-purple-400">99.4%</div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Satisfaction Rate</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl text-center space-y-2">
            <div className="text-3xl sm:text-4xl font-black text-amber-400">18,500+</div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Certificates Issued</p>
          </div>
        </div>
      </section>

      {/* Featured Courses Carousel / Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="indigo" size="sm">TOP PICKS</Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Featured Masterclasses
            </h2>
            <p className="text-sm text-slate-400">Hand-picked courses by our education committee</p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-card rounded-2xl h-80 animate-pulse bg-slate-800/40" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.slice(0, 6).map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* Top Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Explore Top Categories
          </h2>
          <p className="text-sm text-slate-400">
            Choose from the most in-demand disciplines in the modern software economy
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/courses?category=${encodeURIComponent(cat.name)}`}
                className="glass-card p-6 rounded-2xl flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center border group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400">{cat.count}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Instructor Invitation Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900/80 via-slate-900 to-purple-900/80 border border-indigo-500/30 p-8 sm:p-12 lg:p-16">
          <div className="max-w-2xl space-y-6">
            <Badge variant="purple" size="md">INSTRUCTOR STUDIO</Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Share Your Knowledge & Build Your Global Learning Audience
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Create video courses with Cloudinary media integration, manage interactive curriculum sections, publish quizzes, track student enrollments, and earn revenue.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/instructor/dashboard"
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm shadow-xl transition-all"
              >
                Open Instructor Studio
              </Link>
              <Link
                to="/instructor/courses/create"
                className="px-6 py-3.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/40 text-white font-bold text-sm transition-all"
              >
                Create a Course Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
