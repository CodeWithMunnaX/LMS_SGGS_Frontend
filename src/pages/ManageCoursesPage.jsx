import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Video,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  Loader2,
  DollarSign,
  Users
} from 'lucide-react';
import courseService from '../services/courseService';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

export const ManageCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await courseService.getInstructorCourses();
      setCourses(data.courses || []);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (courseId) => {
    try {
      const res = await courseService.toggleCourseStatus(courseId);
      setCourses((prev) =>
        prev.map((c) => (c._id === courseId ? { ...c, status: res.status } : c))
      );
      toast.success(`Course status updated to ${res.status}`);
    } catch (error) {
      toast.error('Failed to toggle status');
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    setDeleting(true);
    try {
      await courseService.deleteCourse(courseToDelete._id);
      setCourses((prev) => prev.filter((c) => c._id !== courseToDelete._id));
      toast.success('Course deleted successfully');
      setCourseToDelete(null);
    } catch (error) {
      toast.error('Failed to delete course');
    } finally {
      setDeleting(false);
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
              Manage Courses
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Publish, update curriculum modules, or adjust course pricing.
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

        {/* Courses List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-card h-24 rounded-2xl animate-pulse bg-slate-800/40" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
            <Video className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No courses created yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Get started by adding your first course details and curriculum video sections.
            </p>
            <Link
              to="/instructor/courses/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-glow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Course</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => {
              const revenue = (course.price || 0) * (course.enrolledStudentsCount || 0);

              return (
                <div
                  key={course._id}
                  className="glass-card p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=200'}
                      alt={course.title}
                      className="w-20 h-14 rounded-xl object-cover bg-slate-900 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={course.status === 'published' ? 'emerald' : 'slate'}
                          size="sm"
                        >
                          {course.status.toUpperCase()}
                        </Badge>
                        <span className="text-[11px] font-bold text-indigo-400">
                          {course.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white">{course.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>Price: <strong className="text-white">${course.price}</strong></span>
                        <span>Students: <strong className="text-white">{course.enrolledStudentsCount || 0}</strong></span>
                        <span>Revenue: <strong className="text-emerald-400">${revenue.toLocaleString()}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <button
                      onClick={() => handleToggleStatus(course._id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        course.status === 'published'
                          ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {course.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>

                    <Link
                      to={`/courses/${course._id}`}
                      target="_blank"
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="View Public Page"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    <Link
                      to={`/instructor/courses/edit/${course._id}`}
                      className="p-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 transition-colors border border-indigo-500/30"
                      title="Edit Course & Curriculum"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => setCourseToDelete(course)}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors border border-rose-500/30"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {courseToDelete && (
          <Modal
            isOpen={Boolean(courseToDelete)}
            onClose={() => setCourseToDelete(null)}
            title="Confirm Course Deletion"
            maxWidth="max-w-md"
          >
            <div className="space-y-4 text-xs text-slate-300">
              <p>
                Are you sure you want to permanently delete{' '}
                <strong className="text-white">"{courseToDelete.title}"</strong>?
              </p>
              <p className="text-rose-400">
                This action is irreversible and will remove all associated curriculum sections, videos, and student enrollments.
              </p>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCourseToDelete(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCourse}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  <span>Delete Course</span>
                </button>
              </div>
            </div>
          </Modal>
        )}
      </main>
    </div>
  );
};

export default ManageCoursesPage;
