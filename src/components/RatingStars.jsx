import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({
  rating = 0,
  max = 5,
  size = 16,
  interactive = false,
  onChange = null,
  showNumber = false
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const currentRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[...Array(max)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = currentRating >= starValue;
          const isHalf = !isFilled && currentRating >= starValue - 0.5;

          return (
            <button
              type="button"
              key={index}
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={`p-0.5 transition-transform ${
                interactive ? 'cursor-pointer hover:scale-125 focus:outline-none' : 'cursor-default'
              }`}
            >
              <Star
                size={size}
                className={`${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : isHalf
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'fill-slate-700 text-slate-600'
                } transition-colors`}
              />
            </button>
          );
        })}
      </div>
      {showNumber && (
        <span className="text-xs font-bold text-amber-400 ml-1">
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
