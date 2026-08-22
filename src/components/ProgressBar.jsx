import React from 'react';

export const ProgressBar = ({
  progress = 0,
  showLabel = true,
  height = 'h-2',
  color = 'from-indigo-500 to-purple-500',
  className = ''
}) => {
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold mb-1.5 text-slate-300">
          <span>Course Progress</span>
          <span className="text-indigo-400">{clampedProgress}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800 rounded-full overflow-hidden ${height} p-[1px]`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500 ease-out shadow-sm`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
