import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, Star, PlayCircle, Users } from 'lucide-react';
import RatingStars from './RatingStars';
import ProgressBar from './ProgressBar';
import Badge from './Badge';

export const CourseCard = ({
  course,
  isEnrolled = false,
  progress = null,
  showInstructor = true
}) => {
  if (!course) return null;

  const {
    _id,
    title,
    subtitle,
    category,
    level,
    price,
    discountPrice,
    thumbnail,
    instructor,
    averageRating = 0,
    numReviews = 0,
    totalLectures = 0,
    totalDuration = 0,
    enrolledStudentsCount = 0
  } = course;

  // Format seconds to hours and minutes
  const formatDuration = (seconds) => {
    if (!seconds) return '1h 30m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const levelColorMap = {
    Beginner: 'emerald',
    Intermediate: 'indigo',
    Advanced: 'rose',
    'All Levels': 'blue'
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1">
      {/* Card Header & Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-slate-900">
        <img
          src={thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Badge variant={levelColorMap[level] || 'indigo'} size="sm">
            {level || 'Beginner'}
          </Badge>
          {price === 0 && (
            <Badge variant="emerald" size="sm">
              FREE
            </Badge>
          )}
        </div>

        {/* Category Pill */}
        <div className="absolute bottom-3 left-3">
          <span className="text-[11px] font-bold text-slate-300 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-slate-700/60">
            {category}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <Link to={`/courses/${_id}`}>
            <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
              {title}
            </h3>
          </Link>
          {subtitle && (
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Instructor Info */}
        {showInstructor && instructor && (
          <div className="flex items-center gap-2.5 pt-1">
            <img
              src={instructor.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150'}
              alt={instructor.name}
              className="w-6 h-6 rounded-full object-cover border border-slate-700"
            />
            <span className="text-xs font-semibold text-slate-300 truncate">
              {instructor.name}
            </span>
          </div>
        )}

        {/* Course Meta Info */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
          <div className="flex items-center gap-1.5">
            <RatingStars rating={averageRating} size={14} showNumber />
            <span className="text-[11px] text-slate-500">({numReviews})</span>
          </div>
          <div className="flex items-center gap-3">
            {totalLectures > 0 && (
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                {totalLectures} lessons
              </span>
            )}
            {totalDuration > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {formatDuration(totalDuration)}
              </span>
            )}
          </div>
        </div>

        {/* Enrolled Progress Bar OR Pricing & CTA */}
        <div className="pt-1">
          {isEnrolled || progress !== null ? (
            <div className="space-y-2">
              <ProgressBar progress={progress ?? 0} />
              <Link
                to={`/learn/${_id}`}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-glow"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Continue Learning</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 pt-2">
              <div>
                {price === 0 ? (
                  <span className="text-base font-black text-emerald-400">Free</span>
                ) : (
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black text-white">
                      ${discountPrice > 0 ? discountPrice : price}
                    </span>
                    {discountPrice > 0 && (
                      <span className="text-xs text-slate-500 line-through">
                        ${price}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <Link
                to={`/courses/${_id}`}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-bold transition-all border border-slate-700/60 hover:border-transparent"
              >
                View Details
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
