import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Upload,
  Globe,
  Twitter,
  Github,
  Linkedin,
  Lock,
  Save,
  Loader2,
  Sparkles
} from 'lucide-react';
import authService from '../services/authService';
import mediaService from '../services/mediaService';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import toast from 'react-hot-toast';

export const ProfilePage = () => {
  const { user, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [website, setWebsite] = useState(user?.website || '');
  const [twitter, setTwitter] = useState(user?.socialLinks?.twitter || '');
  const [github, setGithub] = useState(user?.socialLinks?.github || '');
  const [linkedin, setLinkedin] = useState(user?.socialLinks?.linkedin || '');

  // Avatar upload state
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [avatarPublicId, setAvatarPublicId] = useState(user?.avatarPublicId || null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Instant local preview
    const localAvatarUrl = URL.createObjectURL(file);
    setAvatar(localAvatarUrl);

    setUploadingAvatar(true);
    setUploadProgress(0);
    try {
      const res = await mediaService.uploadMedia(file, 'avatars', (pct) => setUploadProgress(pct));
      if (res.data?.url) {
        setAvatar(res.data.url);
        setAvatarPublicId(res.data.publicId || null);
        toast.success('Avatar uploaded successfully');
      }
    } catch (error) {
      console.warn('Avatar upload fallback:', error);
      const reader = new FileReader();
      reader.onload = (evt) => {
        setAvatar(evt.target.result);
      };
      reader.readAsDataURL(file);
      toast('Avatar updated (local mode)', { icon: '👤' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await authService.updateProfile({
        name,
        headline,
        bio,
        website,
        avatar,
        avatarPublicId,
        socialLinks: { twitter, github, linkedin }
      });
      await refreshUser();
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setChangingPassword(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      const msg = error.response?.data?.message || 'Password update failed';
      toast.error(msg);
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)]">
      <Sidebar type={user?.role || 'student'} />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto max-w-4xl">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage your personal profile, Cloudinary avatar, and security preferences.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="border-b border-slate-800 flex items-center gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'password'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Security & Password</span>
          </button>
        </div>

        {/* Tab 1: Profile Details */}
        {activeTab === 'profile' && (
          <div className="glass-panel p-8 rounded-3xl space-y-8">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-800">
              <div className="relative group">
                <img
                  src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'}
                  alt="Profile Avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500/50 shadow-glow"
                />
                {uploadingAvatar && (
                  <div className="absolute inset-0 rounded-full bg-black/70 flex flex-col items-center justify-center text-white">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                    <span className="text-[10px] font-bold">{uploadProgress}%</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <h4 className="text-sm font-bold text-white">Profile Photo</h4>
                <p className="text-xs text-slate-400">
                  Upload high-res JPG, PNG, or WebP to Cloudinary.
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer transition-colors border border-slate-700">
                  <Upload className="w-4 h-4" />
                  <span>{uploadingAvatar ? 'Uploading...' : 'Upload New Avatar'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    className="hidden"
                    disabled={uploadingAvatar}
                  />
                </label>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Email (Read Only)</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Professional Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Full-Stack Engineer & React Developer"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Bio</label>
                <textarea
                  rows={4}
                  placeholder="Share a brief overview of your background, experience, or learning goals..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Twitter className="w-3.5 h-3.5 text-blue-400" />
                    <span>Twitter / X</span>
                  </label>
                  <input
                    type="text"
                    placeholder="https://x.com/username"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Github className="w-3.5 h-3.5 text-slate-300" />
                    <span>GitHub</span>
                  </label>
                  <input
                    type="text"
                    placeholder="https://github.com/username"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Linkedin className="w-3.5 h-3.5 text-blue-500" />
                    <span>LinkedIn</span>
                  </label>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/in/username"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-glow flex items-center gap-2"
                >
                  {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Security & Password */}
        {activeTab === 'password' && (
          <div className="glass-panel p-8 rounded-3xl space-y-6 max-w-lg">
            <h3 className="text-base font-bold text-white">Update Password</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Current Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Confirm New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-glow flex items-center gap-2"
                >
                  {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  <span>Change Password</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
