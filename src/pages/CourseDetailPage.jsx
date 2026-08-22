import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Play,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lock,
  Star,
  Globe,
  Calendar,
  Share2,
  Sparkles,
  MessageSquare,
  Send,
  Loader2,
  Tv
} from 'lucide-react';
import courseService from '../services/courseService';
import enrollmentService from '../services/enrollmentService';
import reviewService from '../services/reviewService';
import RatingStars from '../components/RatingStars';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import VideoPlayer from '../components/VideoPlayer';
import toast from 'react-hot-toast';

export const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  // Accordion open/collapse states
  const [expandedSections, setExpandedSections] = useState({});

  // Video Preview Modal
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);
  const [previewVideoTitle, setPreviewVideoTitle] = useState('');

  // Write Review State
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      const data = await courseService.getCourseById(id);
      setCourse(data.course);
      setIsEnrolled(data.isEnrolled);
      setReviews(data.reviews || []);

      // Expand first section by default
      if (data.course?.sections?.length > 0) {
        setExpandedSections({ [data.course.sections[0]._id]: true });
      }
    } catch (error) {
      console.error('Failed to load course details:', error);
      toast.error('Course not found');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast('Please log in to enroll', { icon: '🔐' });
      navigate('/login', { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }

    setEnrolling(true);
    try {
      await enrollmentService.enrollInCourse(id);
      toast.success('Successfully enrolled! Loading your classroom...');
      navigate(`/learn/${id}`);
    } catch (error) {
      const msg = error.response?.data?.message || 'Enrollment failed';
      toast.error(msg);
    } finally {
      setEnrolling(false);
    }
  };

  const handleOpenPreview = (videoUrl, title) => {
    if (!videoUrl) return;
    setPreviewVideoUrl(videoUrl);
    setPreviewVideoTitle(title || 'Course Preview');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await reviewService.addReview(id, {
        rating: newRating,
        comment: newComment.trim()
      });
      toast.success('Review published! Thank you for your feedback.');
      setNewComment('');
      // Refetch reviews
      const updatedReviews = await reviewService.getCourseReviews(id);
      setReviews(updatedReviews.reviews || []);
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to submit review';
      toast.error(msg);
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '1h 30m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (loading || !course) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading course curriculum...</p>
      </div>
    );
  }

  const {
    title,
    subtitle,
    description,
    category,
    level,
    language,
    price,
    discountPrice,
    thumbnail,
    promoVideo,
    instructor,
    sections = [],
    whatYouWillLearn = [],
    requirements = [],
    averageRating = 0,
    numReviews = 0,
    totalLectures = 0,
    totalDuration = 0,
    enrolledStudentsCount = 0
  } = course;

  return (
    <div className="space-y-12 pb-24">
      {/* Hero Header Area */}
      <section className="bg-gradient-to-b from-[#0E1526] via-[#0B0F19] to-[#0B0F19] border-b border-slate-800/80 pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Col: Course Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="indigo" size="sm">
                  {category}
                </Badge>
                <Badge variant="slate" size="sm">
                  {level}
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {title}
              </h1>

              {subtitle && (
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                  {subtitle}
                </p>
              )}

              {/* Rating & Stats */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300 pt-1">
                <div className="flex items-center gap-1.5">
                  <RatingStars rating={averageRating} size={16} showNumber />
                  <span className="text-slate-400">({numReviews} reviews)</span>
                </div>
                <div className="text-slate-500">•</div>
                <div>{enrolledStudentsCount.toLocaleString()} students enrolled</div>
                <div className="text-slate-500">•</div>
                <div className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>{language}</span>
                </div>
              </div>

              {/* Instructor Short */}
              {instructor && (
                <div className="flex items-center gap-3 pt-2">
                  <img
                    src={instructor.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150'}
                    alt={instructor.name}
                    className="w-10 h-10 rounded-full object-cover border border-indigo-500/40"
                  />
                  <div>
                    <p className="text-xs text-slate-400">Created by</p>
                    <p className="text-sm font-bold text-white">{instructor.name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Sticky Enrollment Card */}
            <div className="relative">
              <div className="glass-panel p-6 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6 lg:sticky lg:top-24">
                {/* Thumbnail / Video Teaser */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black group">
                  <img
                    src={thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800'}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    {promoVideo ? (
                      <button
                        onClick={() => handleOpenPreview(promoVideo, `${title} (Trailer)`)}
                        className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-glow transform group-hover:scale-110 transition-transform"
                      >
                        <Play className="w-6 h-6 ml-0.5 fill-white" />
                      </button>
                    ) : (
                      <div className="px-3 py-1 rounded-full bg-slate-900/80 text-xs font-bold text-white">
                        Full Course
                      </div>
                    )}
                  </div>
                  {promoVideo && (
                    <div className="absolute bottom-2 inset-x-0 text-center">
                      <span className="text-[11px] font-bold text-white bg-slate-900/90 px-3 py-1 rounded-full border border-slate-700">
                        Watch Preview Trailer
                      </span>
                    </div>
                  )}
                </div>

                {/* Pricing & CTA */}
                <div className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    {price === 0 ? (
                      <span className="text-3xl font-black text-emerald-400">Free</span>
                    ) : (
                      <>
                        <span className="text-3xl font-black text-white">
                          ${discountPrice > 0 ? discountPrice : price}
                        </span>
                        {discountPrice > 0 && (
                          <span className="text-base text-slate-500 line-through">
                            ${price}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {isEnrolled ? (
                    <Link
                      to={`/learn/${course._id}`}
                      className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-glow flex items-center justify-center gap-2 transition-all"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Continue Learning</span>
                    </Link>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold shadow-glow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      {enrolling ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      <span>{price === 0 ? 'Enroll For Free' : 'Enroll in Course'}</span>
                    </button>
                  )}

                  <p className="text-center text-[11px] text-slate-400">
                    30-Day Money-Back Guarantee • Lifetime Access
                  </p>
                </div>

                {/* Course Includes checklist */}
                <div className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-300">
                  <p className="font-bold text-white uppercase tracking-wider text-[11px]">
                    This course includes:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      <span>{formatDuration(totalDuration)} on-demand video</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-indigo-400" />
                      <span>{totalLectures} downloadable & streaming lessons</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Tv className="w-4 h-4 text-indigo-400" />
                      <span>Access on mobile, tablet & desktop</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Official Certificate of Completion</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Details Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            {/* What You'll Learn */}
            {whatYouWillLearn.length > 0 && (
              <div className="glass-panel p-8 rounded-3xl space-y-4">
                <h3 className="text-xl font-bold text-white">What You'll Learn</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {whatYouWillLearn.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-300 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Curriculum Syllabus */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">Course Curriculum</h3>
                  <p className="text-xs text-slate-400 pt-1">
                    {sections.length} sections • {totalLectures} lectures • {formatDuration(totalDuration)} total length
                  </p>
                </div>
              </div>

              {/* Accordion Sections */}
              <div className="space-y-3">
                {sections.map((section, sIndex) => {
                  const isExpanded = expandedSections[section._id];
                  const sectionLecturesCount = section.lectures?.length || 0;
                  const sectionDuration = section.lectures?.reduce((acc, l) => acc + (l.videoDuration || 0), 0) || 0;

                  return (
                    <div
                      key={section._id || sIndex}
                      className="border border-slate-800 bg-slate-900/60 rounded-2xl overflow-hidden transition-all"
                    >
                      {/* Section Header */}
                      <button
                        onClick={() => toggleSection(section._id)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-indigo-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                          <h4 className="text-sm font-bold text-white">
                            {section.title}
                          </h4>
                        </div>
                        <div className="text-xs text-slate-400">
                          {sectionLecturesCount} lectures • {formatDuration(sectionDuration)}
                        </div>
                      </button>

                      {/* Section Lectures Body */}
                      {isExpanded && (
                        <div className="border-t border-slate-800/80 divide-y divide-slate-800/50 bg-slate-950/40">
                          {section.lectures?.map((lecture, lIndex) => (
                            <div
                              key={lecture._id || lIndex}
                              className="px-6 py-3.5 flex items-center justify-between text-xs hover:bg-slate-800/30 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Play className="w-3.5 h-3.5 text-slate-500" />
                                <span className="font-medium text-slate-300">
                                  {lecture.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                                {lecture.isPreviewFree && (
                                  <button
                                    onClick={() => handleOpenPreview(lecture.videoUrl, lecture.title)}
                                    className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 underline"
                                  >
                                    Preview
                                  </button>
                                )}
                                {!lecture.isPreviewFree && !isEnrolled && (
                                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                                )}
                                <span className="text-slate-500 font-mono">
                                  {Math.floor((lecture.videoDuration || 0) / 60)}:
                                  {((lecture.videoDuration || 0) % 60).toString().padStart(2, '0')}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Description</h3>
              <div className="prose prose-invert max-w-none text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {description}
              </div>
            </div>

            {/* Requirements */}
            {requirements.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">Requirements</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
                  {requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Instructor Bio Card */}
            {instructor && (
              <div className="glass-panel p-8 rounded-3xl space-y-4">
                <h3 className="text-2xl font-bold text-white">Your Instructor</h3>
                <div className="flex items-start gap-4 pt-2">
                  <img
                    src={instructor.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'}
                    alt={instructor.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-indigo-500/40"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-base font-bold text-white">{instructor.name}</h4>
                      <a
                        href={instructor.socialLinks?.linkedin || "https://www.linkedin.com/feed/"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] text-xs font-bold transition-colors border border-[#0A66C2]/30"
                        title="View LinkedIn profile"
                      >
                        <span>LinkedIn</span>
                      </a>
                    </div>
                    <p className="text-xs text-indigo-400 font-semibold">{instructor.headline}</p>
                    <p className="text-xs text-slate-400 pt-2 leading-relaxed">{instructor.bio}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-2xl font-bold text-white">Student Feedback</h3>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="text-lg font-black text-white">{averageRating}</span>
                  <span className="text-xs text-slate-400">({numReviews} reviews)</span>
                </div>
              </div>

              {/* Write Review (if enrolled) */}
              {isEnrolled && (
                <form onSubmit={handleSubmitReview} className="glass-panel p-6 rounded-2xl space-y-4">
                  <h4 className="text-sm font-bold text-white">Leave a Course Review</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">Select Rating:</span>
                    <RatingStars
                      rating={newRating}
                      size={20}
                      interactive
                      onChange={(r) => setNewRating(r)}
                    />
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Share your learning experience with other students..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-3.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-glow flex items-center gap-2"
                  >
                    {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Submit Review</span>
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No reviews yet for this course.</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev._id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.student?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100'}
                            alt={rev.student?.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span className="text-xs font-bold text-white">{rev.student?.name}</span>
                        </div>
                        <RatingStars rating={rev.rating} size={12} />
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Preview Teaser Modal */}
      {previewVideoUrl && (
        <Modal
          isOpen={Boolean(previewVideoUrl)}
          onClose={() => setPreviewVideoUrl(null)}
          title={previewVideoTitle}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-4">
            <VideoPlayer src={previewVideoUrl} title={previewVideoTitle} autoPlay />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CourseDetailPage;
