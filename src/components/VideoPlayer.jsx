import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  CheckCircle,
  Settings,
  Sparkles
} from 'lucide-react';

export const VideoPlayer = ({
  src,
  poster = '',
  title = '',
  onEnded = null,
  onProgress = null,
  autoPlay = false
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);

  const controlsTimeoutRef = useRef(null);

  // Format seconds to mm:ss
  const formatTime = (time) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    if (onProgress) {
      onProgress(videoRef.current.currentTime, videoRef.current.duration);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const seekTime = (e.target.value / 100) * duration;
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleSkip = (seconds) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const changeSpeed = (rate) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setSpeedMenuOpen(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleSkip(5);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleSkip(-5);
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted, duration]);

  // Auto-hide controls when mouse is inactive
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl group select-none flex items-center justify-center"
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          if (onEnded) onEnded();
        }}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
        playsInline
      />

      {/* Center Play button overlay on pause */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-indigo-600/90 hover:bg-indigo-500 text-white flex items-center justify-center shadow-glow transition-all transform hover:scale-110 focus:outline-none"
        >
          <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-white" />
        </button>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Bar / Scrubber */}
        <div className="flex items-center gap-2 mb-3">
          <input
            type="range"
            min="0"
            max="100"
            value={duration ? (currentTime / duration) * 100 : 0}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-700/80 hover:h-2.5 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all"
          />
        </div>

        {/* Bottom Controls Bar */}
        <div className="flex items-center justify-between gap-3 text-white text-xs font-semibold">
          {/* Left: Play, Skip, Volume, Time */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-1.5 hover:text-indigo-400 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
            </button>

            <button
              onClick={() => handleSkip(-10)}
              className="p-1.5 hover:text-indigo-400 rounded-lg hover:bg-white/10 transition-colors"
              title="Skip -10s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleSkip(10)}
              className="p-1.5 hover:text-indigo-400 rounded-lg hover:bg-white/10 transition-colors"
              title="Skip +10s"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                onClick={toggleMute}
                className="p-1.5 hover:text-indigo-400 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-rose-400" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hidden group-hover/vol:block transition-all"
              />
            </div>

            {/* Timestamp */}
            <div className="text-slate-300 font-mono text-[11px]">
              <span>{formatTime(currentTime)}</span>
              <span className="text-slate-500 mx-1">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right: Speed, Title, Fullscreen */}
          <div className="flex items-center gap-3">
            {/* Speed Selector */}
            <div className="relative">
              <button
                onClick={() => setSpeedMenuOpen(!speedMenuOpen)}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded-md text-[11px] font-bold tracking-wider transition-colors"
              >
                {playbackRate}x
              </button>

              {speedMenuOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-24 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50">
                  {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => changeSpeed(rate)}
                      className={`w-full px-3 py-1 text-left text-xs ${
                        playbackRate === rate ? 'text-indigo-400 font-bold bg-indigo-500/10' : 'text-slate-200'
                      } hover:bg-slate-800`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 hover:text-indigo-400 rounded-lg hover:bg-white/10 transition-colors"
              title="Fullscreen (F)"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
