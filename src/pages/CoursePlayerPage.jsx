import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Play,
  FileText,
  HelpCircle,
  Download,
  BookOpen,
  Award,
  Sparkles,
  Menu,
  X,
  Save,
  Check,
  Loader2
} from 'lucide-react';
import enrollmentService from '../services/enrollmentService';
import VideoPlayer from '../components/VideoPlayer';
import QuizComponent from '../components/QuizComponent';
import CertificateModal from '../components/CertificateModal';
import ProgressBar from '../components/ProgressBar';
import Badge from '../components/Badge';
import toast from 'react-hot-toast';

export const CoursePlayerPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [enrollment, setEnrollment] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active Lecture State
  const [activeLecture, setActiveLecture] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  // Classroom Tab State: 'overview' | 'quiz' | 'notes' | 'resources'
  const [activeTab, setActiveTab] = useState('overview');

  // Personal Notes State
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [noteSavedNotice, setNoteSavedNotice] = useState(false);

  // Sidebar Open on Mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Certificate Modal State
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  useEffect(() => {
    fetchEnrollmentData();
  }, [courseId]);

  const fetchEnrollmentData = async () => {
    setLoading(true);
    try {
      const data = await enrollmentService.getCourseEnrollment(courseId);
      setEnrollment(data.enrollment);
      setCourse(data.enrollment.course);

      // Select last accessed lecture or first lecture
      const courseObj = data.enrollment.course;
      let targetLecture = null;
      let targetSection = null;

      if (courseObj?.sections?.length > 0) {
        for (const sec of courseObj.sections) {
          if (sec.lectures?.length > 0) {
            const found = sec.lectures.find(
              (l) => l._id.toString() === data.enrollment.lastAccessedLecture?.toString()
            );
            if (found) {
              targetLecture = found;
              targetSection = sec;
              break;
            }
          }
        }

        // Default to first lecture
        if (!targetLecture && courseObj.sections[0].lectures?.length > 0) {
          targetSection = courseObj.sections[0];
          targetLecture = courseObj.sections[0].lectures[0];
        }
      }

      setActiveSection(targetSection);
      setActiveLecture(targetLecture);

      // Populate notes for active lecture
      if (targetLecture && data.enrollment.notes) {
        const savedNote = data.enrollment.notes.find(
          (n) => n.lectureId.toString() === targetLecture._id.toString()
        );
        setNoteText(savedNote ? savedNote.text : '');
      }
    } catch (error) {
      console.error('Failed to load course classroom:', error);
      toast.error('You are not enrolled in this course.');
      navigate(`/courses/${courseId}`);
    } finally {
      setLoading(false);
    }
  };

  // Change Lecture
  const handleSelectLecture = (section, lecture) => {
    setActiveSection(section);
    setActiveLecture(lecture);

    // Load note for this lecture
    if (enrollment?.notes) {
      const savedNote = enrollment.notes.find(
        (n) => n.lectureId.toString() === lecture._id.toString()
      );
      setNoteText(savedNote ? savedNote.text : '');
    } else {
      setNoteText('');
    }
  };

  // Toggle Lecture Completion
  const handleToggleComplete = async (lectureId) => {
    const isAlreadyCompleted = enrollment.completedLectures?.some(
      (id) => id.toString() === lectureId.toString()
    );

    try {
      const res = await enrollmentService.updateLectureProgress(
        courseId,
        lectureId,
        !isAlreadyCompleted
      );

      setEnrollment((prev) => ({
        ...prev,
        completedLectures: res.completedLectures,
        progressPercentage: res.progressPercentage,
        isCompleted: res.isCompleted,
        certificateId: res.certificateId || prev.certificateId
      }));

      if (res.progressPercentage === 100 && !isAlreadyCompleted) {
        setShowCertificateModal(true);
        toast.success('🎉 Congratulations! You have completed all lessons in this course!');
      }
    } catch (error) {
      toast.error('Failed to update lesson progress');
    }
  };

  // Handle Video Auto Advance
  const handleVideoEnded = () => {
    if (activeLecture) {
      // Auto mark complete
      handleToggleComplete(activeLecture._id);

      // Find next lecture in sequence
      if (course?.sections) {
        let foundCurrent = false;
        for (const sec of course.sections) {
          for (const lec of sec.lectures) {
            if (foundCurrent) {
              handleSelectLecture(sec, lec);
              toast('Next lesson auto-started', { icon: '⏩' });
              return;
            }
            if (lec._id.toString() === activeLecture._id.toString()) {
              foundCurrent = true;
            }
          }
        }
      }
    }
  };

  // Save Note
  const handleSaveNote = async () => {
    if (!activeLecture) return;
    setSavingNote(true);
    try {
      await enrollmentService.saveLectureNote(courseId, activeLecture._id, noteText);
      setNoteSavedNotice(true);
      setTimeout(() => setNoteSavedNotice(false), 2500);
      toast.success('Notes saved');
    } catch (error) {
      toast.error('Failed to save notes');
    } finally {
      setSavingNote(false);
    }
  };

  if (loading || !course) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Opening classroom environment...</p>
      </div>
    );
  }

  const isLectureCompleted = (lectureId) => {
    return enrollment?.completedLectures?.some((id) => id.toString() === lectureId.toString());
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-[#070A12]">
      {/* Top Classroom Navigation Bar */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 z-30">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Back to Dashboard"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="overflow-hidden">
            <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-md">
              {course.title}
            </h2>
            <p className="text-[11px] text-slate-400 truncate hidden sm:block">
              {activeLecture ? activeLecture.title : 'Select a lecture'}
            </p>
          </div>
        </div>

        {/* Progress & Certificate Action */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 w-44">
            <ProgressBar progress={enrollment?.progressPercentage || 0} height="h-2" showLabel={false} />
            <span className="text-xs font-bold text-indigo-400 whitespace-nowrap">
              {enrollment?.progressPercentage || 0}%
            </span>
          </div>

          {enrollment?.progressPercentage === 100 && (
            <button
              onClick={() => setShowCertificateModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-lg transition-all animate-pulse"
            >
              <Award className="w-4 h-4" />
              <span>Get Certificate</span>
            </button>
          )}

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white lg:hidden"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Classroom Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Area: Video Player & Tabs */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Video Player Container */}
          <div className="w-full max-w-5xl mx-auto space-y-4">
            {activeLecture?.videoUrl ? (
              <VideoPlayer
                src={activeLecture.videoUrl}
                poster={course.thumbnail}
                title={activeLecture.title}
                onEnded={handleVideoEnded}
              />
            ) : (
              <div className="aspect-video w-full bg-slate-900 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <Play className="w-12 h-12 text-slate-700" />
                <h3 className="text-base font-bold text-slate-300">Reading / Discussion Lesson</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  This lesson does not have a video stream attached. Review the overview and notes below.
                </p>
              </div>
            )}

            {/* Lecture Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="space-y-1">
                <h1 className="text-xl font-extrabold text-white">
                  {activeLecture?.title || 'Lecture Overview'}
                </h1>
                <p className="text-xs text-slate-400">
                  {activeSection?.title}
                </p>
              </div>

              {activeLecture && (
                <button
                  onClick={() => handleToggleComplete(activeLecture._id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-auto ${
                    isLectureCompleted(activeLecture._id)
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isLectureCompleted(activeLecture._id)
                      ? 'Lesson Completed'
                      : 'Mark as Complete'}
                  </span>
                </button>
              )}
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-slate-800 flex items-center gap-6 text-xs font-bold pt-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
                  activeTab === 'overview'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Overview</span>
              </button>

              {activeLecture?.quiz?.length > 0 && (
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
                    activeTab === 'quiz'
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Quiz ({activeLecture.quiz.length})</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('notes')}
                className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
                  activeTab === 'notes'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>My Notes</span>
              </button>

              {activeLecture?.resources?.length > 0 && (
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
                    activeTab === 'resources'
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>Resources ({activeLecture.resources.length})</span>
                </button>
              )}
            </div>

            {/* Tab Contents */}
            <div className="pt-2">
              {activeTab === 'overview' && (
                <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <p>{activeLecture?.description || 'No specific description provided for this lesson.'}</p>
                </div>
              )}

              {activeTab === 'quiz' && activeLecture?.quiz && (
                <QuizComponent quiz={activeLecture.quiz} />
              )}

              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Personal notes for: <strong>{activeLecture?.title}</strong>
                    </span>
                    {noteSavedNotice && (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Saved
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={8}
                    placeholder="Type personal takeaways, code snippets, or key concepts from this lecture..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="w-full p-4 bg-slate-900/80 border border-slate-700/80 rounded-2xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  <button
                    onClick={handleSaveNote}
                    disabled={savingNote}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-glow flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingNote ? 'Saving...' : 'Save Notes'}</span>
                  </button>
                </div>
              )}

              {activeTab === 'resources' && activeLecture?.resources && (
                <div className="space-y-3">
                  {activeLecture.resources.map((res, i) => (
                    <a
                      key={i}
                      href={res.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500 flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold text-white group-hover:text-indigo-400">
                          {res.title}
                        </span>
                      </div>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Curriculum Syllabus */}
        <aside
          className={`${
            isSidebarOpen ? 'block' : 'hidden'
          } lg:block w-80 sm:w-96 bg-slate-900 border-l border-slate-800 overflow-y-auto flex flex-col z-20`}
        >
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 sticky top-0 z-10">
            <h3 className="text-sm font-bold text-white">Course Syllabus</h3>
            <p className="text-[11px] text-slate-400 pt-0.5">
              {enrollment?.completedLectures?.length || 0} of {course.totalLectures || 0} completed
            </p>
          </div>

          <div className="divide-y divide-slate-800/80">
            {course.sections?.map((section, sIdx) => (
              <div key={section._id || sIdx} className="space-y-1">
                <div className="px-4 py-3 bg-slate-950/40 text-xs font-bold text-slate-300">
                  {section.title}
                </div>

                <div className="divide-y divide-slate-800/40">
                  {section.lectures?.map((lecture, lIdx) => {
                    const isCurrent = activeLecture?._id?.toString() === lecture._id?.toString();
                    const completed = isLectureCompleted(lecture._id);

                    return (
                      <button
                        key={lecture._id || lIdx}
                        onClick={() => handleSelectLecture(section, lecture)}
                        className={`w-full px-4 py-3 text-left transition-colors flex items-start gap-3 ${
                          isCurrent
                            ? 'bg-indigo-600/20 text-indigo-300 font-bold border-l-4 border-indigo-500'
                            : 'hover:bg-slate-800/50 text-slate-300'
                        }`}
                      >
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleComplete(lecture._id);
                          }}
                          className="pt-0.5 cursor-pointer hover:scale-125 transition-transform"
                        >
                          {completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600" />
                          )}
                        </div>

                        <div className="flex-1 overflow-hidden space-y-0.5">
                          <p className="text-xs leading-snug truncate">{lecture.title}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                            <span>
                              {Math.floor((lecture.videoDuration || 0) / 60)}:
                              {((lecture.videoDuration || 0) % 60).toString().padStart(2, '0')}
                            </span>
                            {lecture.quiz?.length > 0 && (
                              <span className="text-indigo-400">• Quiz</span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Certificate Modal */}
      {showCertificateModal && (
        <CertificateModal
          isOpen={showCertificateModal}
          onClose={() => setShowCertificateModal(false)}
          certificateData={{
            studentName: user?.name,
            courseTitle: course.title,
            instructorName: course.instructor?.name || 'LearnPulse Instructor',
            certificateId: enrollment?.certificateId || 'LMS-CERT-2026-ACTIVE',
            issuedDate: enrollment?.completedAt || new Date()
          }}
        />
      )}
    </div>
  );
};

export default CoursePlayerPage;
