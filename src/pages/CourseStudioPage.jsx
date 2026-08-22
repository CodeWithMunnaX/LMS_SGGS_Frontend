import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Upload,
  Plus,
  Trash2,
  Video,
  FileText,
  Save,
  Check,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  DollarSign,
  Layers,
  ListPlus,
  Play
} from 'lucide-react';
import courseService from '../services/courseService';
import curriculumService from '../services/curriculumService';
import mediaService from '../services/mediaService';
import Sidebar from '../components/Sidebar';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import ProgressBar from '../components/ProgressBar';
import toast from 'react-hot-toast';

export const CourseStudioPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  // Step 1: Basic Info
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [level, setLevel] = useState('Beginner');
  const [language, setLanguage] = useState('English');
  const [price, setPrice] = useState(49.99);
  const [discountPrice, setDiscountPrice] = useState(0);

  // Media
  const [thumbnail, setThumbnail] = useState('');
  const [thumbnailPublicId, setThumbnailPublicId] = useState(null);
  const [promoVideo, setPromoVideo] = useState('');
  const [promoVideoPublicId, setPromoVideoPublicId] = useState(null);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingPromo, setUploadingPromo] = useState(false);
  const [thumbProgress, setThumbProgress] = useState(0);
  const [promoProgress, setPromoProgress] = useState(0);

  // Step 2: Outcomes & Requirements
  const [whatYouWillLearn, setWhatYouWillLearn] = useState(['']);
  const [requirements, setRequirements] = useState(['']);

  // Step 3: Sections & Lectures
  const [sections, setSections] = useState([]);
  const [status, setStatus] = useState('draft');

  // Video Upload Modal for Lecture
  const [activeUploadLecture, setActiveUploadLecture] = useState(null); // { sectionIndex, lectureIndex }
  const [uploadingLectureVideo, setUploadingLectureVideo] = useState(false);
  const [lectureUploadProgress, setLectureUploadProgress] = useState(0);

  // Quiz Modal for Lecture
  const [activeQuizLecture, setActiveQuizLecture] = useState(null); // { sectionIndex, lectureIndex }
  const [newQuizQuestion, setNewQuizQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswerIndex: 0,
    explanation: ''
  });

  const categoriesList = [
    'Web Development',
    'Data Science & AI',
    'UI/UX Design',
    'Mobile App Development',
    'Cloud Computing & DevOps',
    'Cybersecurity'
  ];

  useEffect(() => {
    if (isEditing) {
      fetchCourseForEdit();
    }
  }, [id]);

  const fetchCourseForEdit = async () => {
    setLoading(true);
    try {
      const data = await courseService.getCourseById(id);
      const c = data.course;
      setTitle(c.title || '');
      setSubtitle(c.subtitle || '');
      setDescription(c.description || '');
      setCategory(c.category || 'Web Development');
      setLevel(c.level || 'Beginner');
      setLanguage(c.language || 'English');
      setPrice(c.price || 0);
      setDiscountPrice(c.discountPrice || 0);
      setThumbnail(c.thumbnail || '');
      setThumbnailPublicId(c.thumbnailPublicId || null);
      setPromoVideo(c.promoVideo || '');
      setPromoVideoPublicId(c.promoVideoPublicId || null);
      setWhatYouWillLearn(c.whatYouWillLearn?.length > 0 ? c.whatYouWillLearn : ['']);
      setRequirements(c.requirements?.length > 0 ? c.requirements : ['']);
      setSections(c.sections || []);
      setStatus(c.status || 'draft');
    } catch (error) {
      toast.error('Failed to load course details for editing');
      navigate('/instructor/courses');
    } finally {
      setLoading(false);
    }
  };

  // Thumbnail Upload Handler with Instant Preview
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Instant local preview so the user immediately sees the image
    const localPreviewUrl = URL.createObjectURL(file);
    setThumbnail(localPreviewUrl);

    setUploadingThumb(true);
    setThumbProgress(0);
    try {
      const res = await mediaService.uploadMedia(file, 'thumbnails', (pct) => setThumbProgress(pct));
      if (res.data?.url) {
        setThumbnail(res.data.url);
        setThumbnailPublicId(res.data.publicId || null);
        if (res.data.warning) {
          toast('Image saved locally (Cloudinary API key has restricted permissions)', { icon: 'ℹ️' });
        } else {
          toast.success('Thumbnail uploaded to Cloudinary');
        }
      }
    } catch (error) {
      console.warn('Upload error, retaining local image preview:', error);
      // Keep local preview so user doesn't lose their selected image
      const reader = new FileReader();
      reader.onload = (evt) => {
        setThumbnail(evt.target.result);
      };
      reader.readAsDataURL(file);
      toast('Image loaded in local preview mode', { icon: '🖼️' });
    } finally {
      setUploadingThumb(false);
    }
  };

  // Promo Video Upload Handler with Instant Preview
  const handlePromoVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const localVideoUrl = URL.createObjectURL(file);
    setPromoVideo(localVideoUrl);

    setUploadingPromo(true);
    setPromoProgress(0);
    try {
      const res = await mediaService.uploadMedia(file, 'trailers', (pct) => setPromoProgress(pct));
      if (res.data?.url) {
        setPromoVideo(res.data.url);
        setPromoVideoPublicId(res.data.publicId || null);
        toast.success('Promo video uploaded');
      }
    } catch (error) {
      console.warn('Video upload fallback:', error);
      toast('Video loaded in local preview mode', { icon: '🎬' });
    } finally {
      setUploadingPromo(false);
    }
  };


  // Step 2 Array Helpers
  const handleAddOutcome = () => setWhatYouWillLearn([...whatYouWillLearn, '']);
  const handleRemoveOutcome = (idx) => setWhatYouWillLearn(whatYouWillLearn.filter((_, i) => i !== idx));
  const handleOutcomeChange = (idx, val) => {
    const updated = [...whatYouWillLearn];
    updated[idx] = val;
    setWhatYouWillLearn(updated);
  };

  const handleAddRequirement = () => setRequirements([...requirements, '']);
  const handleRemoveRequirement = (idx) => setRequirements(requirements.filter((_, i) => i !== idx));
  const handleRequirementChange = (idx, val) => {
    const updated = [...requirements];
    updated[idx] = val;
    setRequirements(updated);
  };

  // Step 3 Curriculum Helpers
  const handleAddSection = () => {
    const newSection = {
      title: `Section ${sections.length + 1}: Untitled Section`,
      description: '',
      order: sections.length,
      lectures: []
    };
    setSections([...sections, newSection]);
  };

  const handleRemoveSection = (sIdx) => {
    setSections(sections.filter((_, i) => i !== sIdx));
  };

  const handleSectionTitleChange = (sIdx, val) => {
    const updated = [...sections];
    updated[sIdx].title = val;
    setSections(updated);
  };

  const handleAddLecture = (sIdx) => {
    const updated = [...sections];
    const newLecture = {
      title: `Lecture ${updated[sIdx].lectures.length + 1}: New Lesson`,
      description: '',
      videoUrl: '',
      videoPublicId: null,
      videoDuration: 0,
      isPreviewFree: false,
      resources: [],
      quiz: [],
      order: updated[sIdx].lectures.length
    };
    updated[sIdx].lectures.push(newLecture);
    setSections(updated);
  };

  const handleRemoveLecture = (sIdx, lIdx) => {
    const updated = [...sections];
    updated[sIdx].lectures = updated[sIdx].lectures.filter((_, i) => i !== lIdx);
    setSections(updated);
  };

  const handleLectureChange = (sIdx, lIdx, field, val) => {
    const updated = [...sections];
    updated[sIdx].lectures[lIdx][field] = val;
    setSections(updated);
  };

  // Lecture Video Cloudinary Upload
  const handleLectureVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeUploadLecture) return;

    setUploadingLectureVideo(true);
    setLectureUploadProgress(0);
    try {
      const res = await mediaService.uploadMedia(file, 'lectures', (pct) => setLectureUploadProgress(pct));
      const { sectionIndex, lectureIndex } = activeUploadLecture;
      const updated = [...sections];
      updated[sectionIndex].lectures[lectureIndex].videoUrl = res.data.url;
      updated[sectionIndex].lectures[lectureIndex].videoPublicId = res.data.publicId;
      updated[sectionIndex].lectures[lectureIndex].videoDuration = res.data.duration || 450;
      setSections(updated);
      toast.success('Lecture video uploaded to Cloudinary');
      setActiveUploadLecture(null);
    } catch (error) {
      toast.error('Failed to upload lecture video');
    } finally {
      setUploadingLectureVideo(false);
    }
  };

  // Save Quiz Question to Lecture
  const handleSaveQuizQuestion = () => {
    if (!newQuizQuestion.question.trim()) {
      toast.error('Please enter a question');
      return;
    }
    const { sectionIndex, lectureIndex } = activeQuizLecture;
    const updated = [...sections];
    if (!updated[sectionIndex].lectures[lectureIndex].quiz) {
      updated[sectionIndex].lectures[lectureIndex].quiz = [];
    }
    updated[sectionIndex].lectures[lectureIndex].quiz.push({ ...newQuizQuestion });
    setSections(updated);
    toast.success('Quiz question added');
    setNewQuizQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0,
      explanation: ''
    });
  };

  // Save Complete Course
  const handleSaveCourse = async (publishImmediate = false) => {
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in course title and description');
      setCurrentStep(1);
      return;
    }

    setSaving(true);
    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      category,
      level,
      language,
      price: Number(price) || 0,
      discountPrice: Number(discountPrice) || 0,
      thumbnail: thumbnail || undefined,
      thumbnailPublicId,
      promoVideo,
      promoVideoPublicId,
      whatYouWillLearn: whatYouWillLearn.filter((w) => w.trim() !== ''),
      requirements: requirements.filter((r) => r.trim() !== ''),
      sections,
      status: publishImmediate ? 'published' : status
    };

    try {
      if (isEditing) {
        await courseService.updateCourse(id, payload);
        toast.success('Course curriculum updated successfully');
      } else {
        const res = await courseService.createCourse(payload);
        toast.success('Course created successfully');
      }
      navigate('/instructor/courses');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to save course';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-xs text-slate-400 font-medium">Loading Course Studio...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)]">
      <Sidebar type="instructor" />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto max-w-5xl">
        {/* Top Studio Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="indigo" size="sm">
                COURSE STUDIO
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-1">
              {isEditing ? `Edit: ${title || 'Course'}` : 'Create New Course'}
            </h1>
            <p className="text-xs text-slate-400">
              Build your video syllabus, upload Cloudinary media, and configure learning milestones.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSaveCourse(false)}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
            >
              Save as Draft
            </button>
            <button
              onClick={() => handleSaveCourse(true)}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-glow transition-all flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isEditing ? 'Save & Update' : 'Publish Course'}</span>
            </button>
          </div>
        </div>

        {/* Wizard Steps Bar */}
        <div className="grid grid-cols-4 gap-2 text-xs font-bold">
          {[
            { step: 1, title: '1. Basic Info' },
            { step: 2, title: '2. Outcomes' },
            { step: 3, title: '3. Curriculum & Videos' },
            { step: 4, title: '4. Pricing & Publish' }
          ].map((s) => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`py-3 px-2 rounded-xl text-center transition-all ${
                currentStep === s.step
                  ? 'bg-indigo-600 text-white shadow-glow'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* STEP 1: Basic Info & Media */}
        {currentStep === 1 && (
          <div className="glass-panel p-8 rounded-3xl space-y-6">
            <h3 className="text-base font-bold text-white">Course Overview & Media</h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Modern Full-Stack Web Development with React & Node"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Subtitle / Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Build production-ready web apps from scratch with modern architecture."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Difficulty Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Language</label>
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Course Description *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Provide an engaging and comprehensive overview of the curriculum and technologies..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              {/* Cloudinary Media Uploads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                {/* Thumbnail Upload */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200">
                      Course Thumbnail (Cloudinary)
                    </label>
                    {thumbnail && (
                      <button
                        type="button"
                        onClick={() => {
                          setThumbnail('');
                          setThumbnailPublicId(null);
                        }}
                        className="text-[11px] font-semibold text-rose-400 hover:underline"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>

                  <div className="aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 relative flex items-center justify-center group shadow-inner">
                    {thumbnail ? (
                      <>
                        <img src={thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-lg flex items-center gap-1.5">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Change Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleThumbnailUpload}
                              className="hidden"
                              disabled={uploadingThumb}
                            />
                          </label>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4 space-y-1">
                        <Upload className="w-6 h-6 text-slate-600 mx-auto" />
                        <span className="text-xs text-slate-500 block">No thumbnail selected</span>
                      </div>
                    )}
                    {uploadingThumb && (
                      <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center text-white z-10">
                        <Loader2 className="w-7 h-7 animate-spin text-indigo-400" />
                        <span className="text-[11px] font-bold mt-2">Processing image... {thumbProgress}%</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="w-full py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-bold cursor-pointer transition-colors border border-indigo-500/40 flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4" />
                      <span>{thumbnail ? 'Upload Different Image' : 'Select Image to Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="hidden"
                        disabled={uploadingThumb}
                      />
                    </label>

                    {/* Or Paste Direct Image URL */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Or paste direct image URL (https://...)"
                        value={thumbnail && !thumbnail.startsWith('data:') && !thumbnail.startsWith('blob:') ? thumbnail : ''}
                        onChange={(e) => {
                          setThumbnail(e.target.value);
                          setThumbnailPublicId(null);
                        }}
                        className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Promo Trailer Video Upload */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200">
                      Promo Preview Trailer (Cloudinary)
                    </label>
                    {promoVideo && (
                      <button
                        type="button"
                        onClick={() => {
                          setPromoVideo('');
                          setPromoVideoPublicId(null);
                        }}
                        className="text-[11px] font-semibold text-rose-400 hover:underline"
                      >
                        Remove Video
                      </button>
                    )}
                  </div>

                  <div className="aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 relative flex items-center justify-center shadow-inner">
                    {promoVideo ? (
                      <video src={promoVideo} controls className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4 space-y-1">
                        <Video className="w-6 h-6 text-slate-600 mx-auto" />
                        <span className="text-xs text-slate-500 block">No promo video uploaded</span>
                      </div>
                    )}
                    {uploadingPromo && (
                      <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center text-white z-10">
                        <Loader2 className="w-7 h-7 animate-spin text-indigo-400" />
                        <span className="text-[11px] font-bold mt-2">Uploading video... {promoProgress}%</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition-colors border border-slate-700 flex items-center justify-center gap-2">
                      <Video className="w-4 h-4 text-indigo-400" />
                      <span>{promoVideo ? 'Change Promo Video' : 'Upload Video File'}</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handlePromoVideoUpload}
                        className="hidden"
                        disabled={uploadingPromo}
                      />
                    </label>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Or paste video URL (.mp4)"
                        value={promoVideo && !promoVideo.startsWith('blob:') ? promoVideo : ''}
                        onChange={(e) => {
                          setPromoVideo(e.target.value);
                          setPromoVideoPublicId(null);
                        }}
                        className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-glow flex items-center gap-2"
              >
                <span>Continue to Outcomes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Outcomes & Requirements */}
        {currentStep === 2 && (
          <div className="glass-panel p-8 rounded-3xl space-y-8">
            {/* What You Will Learn */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">What Students Will Learn</h3>
                  <p className="text-xs text-slate-400">Key competencies and take-aways.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddOutcome}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Outcome</span>
                </button>
              </div>

              <div className="space-y-2">
                {whatYouWillLearn.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Build end-to-end full stack web applications with React and Express"
                      value={item}
                      onChange={(e) => handleOutcomeChange(idx, e.target.value)}
                      className="flex-1 p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    {whatYouWillLearn.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOutcome(idx)}
                        className="p-2 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-4 pt-6 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Prerequisites & Requirements</h3>
                  <p className="text-xs text-slate-400">Tools or prior knowledge needed.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddRequirement}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Requirement</span>
                </button>
              </div>

              <div className="space-y-2">
                {requirements.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Basic understanding of JavaScript and HTML"
                      value={item}
                      onChange={(e) => handleRequirementChange(idx, e.target.value)}
                      className="flex-1 p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    {requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirement(idx)}
                        className="p-2 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-glow flex items-center gap-2"
              >
                <span>Continue to Curriculum</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Curriculum & Cloudinary Videos */}
        {currentStep === 3 && (
          <div className="glass-panel p-8 rounded-3xl space-y-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Curriculum Sections & Video Lessons</h3>
                <p className="text-xs text-slate-400">
                  Organize your course into structured chapters and upload video lectures to Cloudinary.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddSection}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-glow flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Section</span>
              </button>
            </div>

            {sections.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
                <Layers className="w-8 h-8 text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-white">No sections added yet</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Click "Add Section" to create your first chapter.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {sections.map((section, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4"
                  >
                    {/* Section Header Row */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 flex items-center gap-3">
                        <span className="text-xs font-bold text-indigo-400">Section {sIdx + 1}:</span>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => handleSectionTitleChange(sIdx, e.target.value)}
                          className="flex-1 p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddLecture(sIdx)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Lesson</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSection(sIdx)}
                          className="p-1.5 text-slate-500 hover:text-rose-400"
                          title="Remove Section"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Lectures List inside Section */}
                    <div className="space-y-3 pt-2 pl-4 border-l-2 border-slate-800">
                      {section.lectures?.map((lecture, lIdx) => (
                        <div
                          key={lIdx}
                          className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <input
                              type="text"
                              value={lecture.title}
                              onChange={(e) =>
                                handleLectureChange(sIdx, lIdx, 'title', e.target.value)
                              }
                              placeholder="Lecture title"
                              className="flex-1 p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveLecture(sIdx, lIdx)}
                              className="p-1.5 text-slate-600 hover:text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Lecture Actions & Media Row */}
                          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                            <div className="flex items-center gap-4">
                              {/* Cloudinary Video Status */}
                              {lecture.videoUrl ? (
                                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                                  <Video className="w-4 h-4" />
                                  <span>Video Uploaded</span>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setActiveUploadLecture({ sectionIndex: sIdx, lectureIndex: lIdx })}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 font-bold"
                                >
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>Upload Video</span>
                                </button>
                              )}

                              {/* Free Preview Toggle */}
                              <label className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-white">
                                <input
                                  type="checkbox"
                                  checked={Boolean(lecture.isPreviewFree)}
                                  onChange={(e) =>
                                    handleLectureChange(sIdx, lIdx, 'isPreviewFree', e.target.checked)
                                  }
                                  className="rounded accent-indigo-600"
                                />
                                <span>Free Preview</span>
                              </label>

                              {/* Quiz Button */}
                              <button
                                type="button"
                                onClick={() => setActiveQuizLecture({ sectionIndex: sIdx, lectureIndex: lIdx })}
                                className="flex items-center gap-1 text-slate-400 hover:text-indigo-400"
                              >
                                <HelpCircle className="w-3.5 h-3.5" />
                                <span>Quiz ({lecture.quiz?.length || 0})</span>
                              </button>
                            </div>

                            <div className="text-[11px] text-slate-500 font-mono">
                              Duration: {Math.floor((lecture.videoDuration || 0) / 60)}m
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-glow flex items-center gap-2"
              >
                <span>Continue to Pricing & Publishing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Pricing & Publishing */}
        {currentStep === 4 && (
          <div className="glass-panel p-8 rounded-3xl space-y-8">
            <h3 className="text-base font-bold text-white">Course Pricing & Publishing</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Course Price ($ USD) * (0 for Free)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
                  />
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Discount Price ($ USD) (Optional)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
                  />
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Publish Status Selector */}
            <div className="space-y-3 pt-4 border-t border-slate-800 max-w-lg">
              <label className="text-xs font-bold text-slate-200">Publication Status</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('draft')}
                  className={`p-4 rounded-2xl border text-xs font-bold text-left transition-all ${
                    status === 'draft'
                      ? 'bg-slate-800 text-white border-indigo-500'
                      : 'bg-slate-950 text-slate-500 border-slate-800'
                  }`}
                >
                  <p className="font-bold text-white">Draft</p>
                  <p className="text-[11px] text-slate-400 font-normal pt-1">
                    Hidden from search catalog. Only you can access.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('published')}
                  className={`p-4 rounded-2xl border text-xs font-bold text-left transition-all ${
                    status === 'published'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500'
                      : 'bg-slate-950 text-slate-500 border-slate-800'
                  }`}
                >
                  <p className="font-bold text-emerald-400">Published</p>
                  <p className="text-[11px] text-slate-400 font-normal pt-1">
                    Live on the catalog and available for enrollment.
                  </p>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveCourse(status === 'published')}
                disabled={saving}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black shadow-glow flex items-center gap-2 transition-all"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save & Complete Course</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal: Cloudinary Video Upload for Lecture */}
        {activeUploadLecture && (
          <Modal
            isOpen={Boolean(activeUploadLecture)}
            onClose={() => setActiveUploadLecture(null)}
            title="Upload Lecture Video to Cloudinary"
            maxWidth="max-w-md"
          >
            <div className="space-y-4 text-xs text-slate-300">
              <p>
                Select high-definition MP4, WebM, or MOV video. The video will be streamed via Cloudinary CDN.
              </p>

              {uploadingLectureVideo && (
                <div className="space-y-2 py-4">
                  <ProgressBar progress={lectureUploadProgress} />
                  <p className="text-center text-[11px] text-indigo-400 font-bold">
                    Streaming to Cloudinary... {lectureUploadProgress}%
                  </p>
                </div>
              )}

              <label className="w-full py-4 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold cursor-pointer transition-colors flex flex-col items-center justify-center gap-2">
                <Video className="w-8 h-8 text-indigo-400" />
                <span>{uploadingLectureVideo ? 'Uploading...' : 'Choose Video File'}</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleLectureVideoUpload}
                  className="hidden"
                  disabled={uploadingLectureVideo}
                />
              </label>
            </div>
          </Modal>
        )}

        {/* Modal: Add Quiz Question to Lecture */}
        {activeQuizLecture && (
          <Modal
            isOpen={Boolean(activeQuizLecture)}
            onClose={() => setActiveQuizLecture(null)}
            title="Lecture Quiz Builder"
            maxWidth="max-w-xl"
          >
            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-200">Question</label>
                <input
                  type="text"
                  placeholder="e.g. What is the role of Virtual DOM in React?"
                  value={newQuizQuestion.question}
                  onChange={(e) => setNewQuizQuestion({ ...newQuizQuestion, question: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-200">Multiple Choice Options (Select Correct)</label>
                {newQuizQuestion.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={newQuizQuestion.correctAnswerIndex === oIdx}
                      onChange={() => setNewQuizQuestion({ ...newQuizQuestion, correctAnswerIndex: oIdx })}
                      className="accent-indigo-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder={`Option ${oIdx + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const updated = [...newQuizQuestion.options];
                        updated[oIdx] = e.target.value;
                        setNewQuizQuestion({ ...newQuizQuestion, options: updated });
                      }}
                      className="flex-1 p-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-200">Answer Explanation (Optional)</label>
                <input
                  type="text"
                  placeholder="Brief rationale shown after the student attempts the question"
                  value={newQuizQuestion.explanation}
                  onChange={(e) => setNewQuizQuestion({ ...newQuizQuestion, explanation: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveQuizLecture(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Done
                </button>
                <button
                  type="button"
                  onClick={handleSaveQuizQuestion}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-glow"
                >
                  Add Question
                </button>
              </div>
            </div>
          </Modal>
        )}
      </main>
    </div>
  );
};

export default CourseStudioPage;
