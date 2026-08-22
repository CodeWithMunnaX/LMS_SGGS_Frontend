import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Github, Twitter, Linkedin, Youtube, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#070A12] border-t border-slate-800/80 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-glow">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Learn<span className="text-indigo-400">Pulse</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering learners and educators worldwide with high-definition video classrooms, hands-on curriculum builder, Cloudinary media processing, and accredited digital certificates.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all" title="Twitter / X">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://github.com/CodeWithMunnaX" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all" title="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/feed/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-[#0A66C2] hover:text-white flex items-center justify-center transition-all text-[#0A66C2]" title="LinkedIn">
                <Linkedin className="w-4 h-4 fill-current" />
              </a>
              <a href="https://www.youtube.com/@CodeWithMunnaX" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-all text-rose-500" title="YouTube @CodeWithMunnaX">
                <Youtube className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/courses" className="hover:text-indigo-400 transition-colors">All Courses</Link></li>
              <li><Link to="/courses?category=Web+Development" className="hover:text-indigo-400 transition-colors">Web Development</Link></li>
              <li><Link to="/courses?category=Data+Science+%26+AI" className="hover:text-indigo-400 transition-colors">Data Science & AI</Link></li>
              <li><Link to="/courses?category=UI%2FUX+Design" className="hover:text-indigo-400 transition-colors">UI/UX Design</Link></li>
              <li><Link to="/courses?priceType=free" className="hover:text-indigo-400 transition-colors">Free Courses</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/dashboard" className="hover:text-indigo-400 transition-colors">Student Dashboard</Link></li>
              <li><Link to="/instructor/dashboard" className="hover:text-indigo-400 transition-colors">Instructor Studio</Link></li>
              <li><Link to="/certificates" className="hover:text-indigo-400 transition-colors">Verify Certificate</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-indigo-400 transition-colors">Admin Panel</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Stay Updated</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get monthly updates on top trending tech courses and free learning resources.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LearnPulse LMS. Built with React, Tailwind CSS, Node & Cloudinary.</p>
          <div className="flex items-center gap-1">
            <span>Crafted for high-performance online education</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
