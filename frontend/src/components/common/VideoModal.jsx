import { useState, useRef, useEffect } from "react";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Tv,
  Film,
  Sparkles,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

function formatTime(seconds) {
  if (isNaN(seconds) || seconds === null) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function VideoModal({
  video,
  youtubeId,
  title,
  videoUrl,
  fallbackUrl,
  category,
  onClose,
}) {
  // Resolve properties whether passed as an object or individual props
  const activeTitle = video?.title || title || "Cinematic Master Film";
  const activeCategory = video?.category || category || "Cinema Showcase";
  const activePrimaryUrl =
    video?.videoUrl ||
    videoUrl ||
    "/videos/sample-film.mp4";
  const activeFallbackUrl =
    video?.fallbackUrl ||
    fallbackUrl ||
    "https://media.w3.org/2010/05/sintel/trailer.mp4";
  const activeYoutubeId =
    video?.youtubeId || (typeof youtubeId === "string" ? youtubeId : null) || "ysz5S6PUM-U";
  const activePoster = video?.poster || video?.thumbnail || "";
  const activeQuality = video?.quality || "4K DCI · 60FPS · PRORES 422 HQ";
  const activeDuration = video?.duration || "04:30";
  const activeDirector = video?.director || "SVML Master Cinema Unit";
  const activeDescription =
    video?.description ||
    "Cinematic wedding documentary recorded with multi-camera cinema rigs, Hollywood color science, and live Dolby Atmos audio.";

  // Mode: 'direct' (HTML5 native 4K) or 'youtube'
  const [sourceMode, setSourceMode] = useState("direct");
  const [currentStreamSrc, setCurrentStreamSrc] = useState(activePrimaryUrl);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [streamError, setStreamError] = useState(false);

  // Player state
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimer = useRef(null);

  // Auto-play on mount when in direct mode
  useEffect(() => {
    if (sourceMode === "direct" && videoRef.current) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        // Browser autoplay policy might require mute
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      });
    }
  }, [sourceMode, currentStreamSrc]);

  // Handle stream error with auto-fallback
  const handleVideoError = () => {
    if (!isUsingFallback && activeFallbackUrl) {
      console.warn("Primary stream unavailable, swapping to resilient mirror fallback:", activeFallbackUrl);
      setIsUsingFallback(true);
      setCurrentStreamSrc(activeFallbackUrl);
      setStreamError(false);
    } else {
      setStreamError(true);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.code === "Space" && sourceMode === "direct") {
        e.preventDefault();
        togglePlay();
      } else if (e.key.toLowerCase() === "m" && sourceMode === "direct") {
        toggleMute();
      } else if (e.key.toLowerCase() === "f" && sourceMode === "direct") {
        toggleFullscreen();
      } else if (e.key === "ArrowLeft" && videoRef.current) {
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
      } else if (e.key === "ArrowRight" && videoRef.current) {
        videoRef.current.currentTime = Math.min(
          videoRef.current.duration || 9999,
          videoRef.current.currentTime + 5
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isMuted, isFullscreen, sourceMode]);

  // Control visibility timer
  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    if (isPlaying) {
      hideControlsTimer.current = setTimeout(() => setShowControls(false), 2800);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 2, 0.75];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIdx];
    setPlaybackRate(nextRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextRate;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-hidden animate-fade-in"
      onClick={onClose}
    >
      {/* Non-Cropping Viewport-Constrained Modal Card */}
      <div
        className="relative w-full max-w-4xl lg:max-w-5xl max-h-[92vh] flex flex-col rounded-2xl border border-white/15 bg-zinc-950 shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar (Fixed Height, never cropped) */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5 sm:py-3 border-b border-white/10 bg-black/60 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 shrink-0">
              <Film className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-gold-400 font-semibold truncate">
                  {activeCategory}
                </span>
                <span className="hidden sm:inline-block text-[9px] uppercase font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {activeQuality}
                </span>
              </div>
              <h3 className="font-serif text-base sm:text-lg text-ink-50 font-normal leading-tight truncate">
                {activeTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Source Switcher Pill */}
            <div className="flex items-center rounded-full bg-black/60 p-1 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setSourceMode("direct")}
                className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  sourceMode === "direct"
                    ? "bg-gold-400 text-ink-950 shadow-md"
                    : "text-ink-300 hover:text-white"
                }`}
                title="Ultra-fast native direct stream"
              >
                4K Stream
              </button>
              <button
                type="button"
                onClick={() => setSourceMode("youtube")}
                className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  sourceMode === "youtube"
                    ? "bg-gold-400 text-ink-950 shadow-md"
                    : "text-ink-300 hover:text-white"
                }`}
                title="YouTube cinema embed"
              >
                YouTube
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-ink-300 hover:text-white hover:border-gold-400 hover:bg-gold-400/10 transition-colors cursor-pointer"
              aria-label="Close Cinema Player"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Player Container (Flex-1, Height-Constrained, 100% Non-Cropping) */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="relative flex-1 min-h-0 w-full bg-black flex items-center justify-center overflow-hidden"
          style={{ maxHeight: 'calc(92vh - 120px)' }}
        >
          <div className="relative w-full h-full max-h-[62vh] aspect-video mx-auto flex items-center justify-center bg-black">
            {sourceMode === "direct" ? (
              <>
                {/* Native Video Element */}
                <video
                  ref={videoRef}
                  src={currentStreamSrc}
                  poster={activePoster}
                  playsInline
                  preload="metadata"
                  onTimeUpdate={() => {
                    if (videoRef.current) {
                      setCurrentTime(videoRef.current.currentTime);
                    }
                  }}
                  onLoadedMetadata={() => {
                    if (videoRef.current) {
                      setDuration(videoRef.current.duration || 0);
                    }
                  }}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  onError={handleVideoError}
                  onClick={togglePlay}
                  className="w-full h-full max-h-[62vh] object-contain cursor-pointer"
                />

                {/* Big Center Play / Pause Indicator */}
                {(!isPlaying || showControls) && (
                  <div
                    onClick={togglePlay}
                    className={`absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-gold-400/40 text-gold-300 flex items-center justify-center shadow-2xl transition-all cursor-pointer ${
                      isPlaying
                        ? "opacity-0 hover:opacity-100 hover:scale-105"
                        : "opacity-100 scale-100 animate-pulse"
                    }`}
                  >
                    {isPlaying ? (
                      <Pause className="w-7 h-7 fill-current" />
                    ) : (
                      <Play className="w-7 h-7 ml-1 fill-current" />
                    )}
                  </div>
                )}

                {/* Error Recovery Overlay */}
                {streamError && (
                  <div className="absolute inset-0 bg-ink-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
                    <AlertCircle className="w-10 h-10 text-gold-400 mb-2" />
                    <h4 className="font-serif text-xl text-ink-50 mb-1">Stream Connection Notice</h4>
                    <p className="text-xs text-ink-300 max-w-md mb-4 leading-relaxed">
                      The video stream is reconnecting. You can retry with our local offline stream or view the YouTube player.
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setStreamError(false);
                          setCurrentStreamSrc("/videos/sample-film.mp4");
                          if (videoRef.current) {
                            videoRef.current.load();
                            videoRef.current.play().catch(() => {});
                          }
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-400 text-ink-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Play Local Stream</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setStreamError(false);
                          setSourceMode("youtube");
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 text-white font-bold text-xs uppercase tracking-wider hover:border-gold-400 hover:text-gold-300 transition-all cursor-pointer"
                      >
                        <Tv className="w-3.5 h-3.5 text-gold-400" />
                        <span>Switch to YouTube</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Top Telemetry Overlay */}
                <div
                  className={`absolute top-3 inset-x-3 flex items-center justify-between text-[9px] font-mono text-gold-300 uppercase tracking-widest pointer-events-none transition-opacity duration-300 ${
                    showControls ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="bg-black/70 px-2 py-0.5 rounded border border-white/10 backdrop-blur-md">
                    REC ● 4K DCI · 60 FPS
                  </span>
                  {isUsingFallback && (
                    <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30 backdrop-blur-md flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Backup Mirror Active
                    </span>
                  )}
                </div>

                {/* Bottom Custom Cinema HUD Controls */}
                <div
                  className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 sm:p-4 pt-6 transition-opacity duration-300 ${
                    showControls ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  {/* Timeline Progress Slider */}
                  <div className="relative group/timeline mb-2.5">
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-gold-400 hover:h-2 transition-all focus:outline-none"
                      aria-label="Seek Video Timeline"
                    />
                    <div
                      className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-gold-500 to-gold-400 rounded-full pointer-events-none group-hover/timeline:h-2 transition-all"
                      style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                    />
                  </div>

                  {/* Control Action Buttons */}
                  <div className="flex items-center justify-between gap-3 text-ink-200">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="w-8 h-8 rounded-full bg-gold-400 text-ink-950 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                        title={isPlaying ? "Pause (Space)" : "Play (Space)"}
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 ml-0.5 fill-current" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (videoRef.current) videoRef.current.currentTime -= 10;
                        }}
                        className="w-7 h-7 rounded-full border border-white/10 hover:border-gold-400 hover:text-gold-300 flex items-center justify-center transition-colors cursor-pointer"
                        title="Rewind 10s (←)"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (videoRef.current) videoRef.current.currentTime += 10;
                        }}
                        className="w-7 h-7 rounded-full border border-white/10 hover:border-gold-400 hover:text-gold-300 flex items-center justify-center transition-colors cursor-pointer"
                        title="Forward 10s (→)"
                      >
                        <RotateCw className="w-3 h-3" />
                      </button>

                      {/* Time Counter */}
                      <div className="text-[11px] font-mono text-ink-300 pl-1">
                        <span className="text-gold-400 font-semibold">{formatTime(currentTime)}</span>
                        <span className="text-ink-500 mx-1">/</span>
                        <span>{formatTime(duration || 0)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Volume Slider & Mute */}
                      <div className="flex items-center gap-1.5 group/volume">
                        <button
                          type="button"
                          onClick={toggleMute}
                          className="w-7 h-7 rounded-full border border-white/10 hover:border-gold-400 hover:text-gold-300 flex items-center justify-center transition-colors cursor-pointer"
                          title={isMuted ? "Unmute (M)" : "Mute (M)"}
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX className="w-3.5 h-3.5 text-red-400" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5 text-gold-400" />
                          )}
                        </button>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.05}
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-14 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-gold-400 hidden sm:block"
                          aria-label="Volume Slider"
                        />
                      </div>

                      {/* Playback Speed Pill */}
                      <button
                        type="button"
                        onClick={cyclePlaybackRate}
                        className="px-2 py-0.5 rounded border border-white/10 hover:border-gold-400 text-[10px] font-mono text-gold-300 hover:text-white transition-colors cursor-pointer"
                        title="Playback Speed"
                      >
                        {playbackRate}x
                      </button>

                      {/* Fullscreen Button */}
                      <button
                        type="button"
                        onClick={toggleFullscreen}
                        className="w-7 h-7 rounded-full border border-white/10 hover:border-gold-400 hover:text-gold-300 flex items-center justify-center transition-colors cursor-pointer"
                        title="Fullscreen (F)"
                      >
                        {isFullscreen ? (
                          <Minimize2 className="w-3.5 h-3.5" />
                        ) : (
                          <Maximize2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* YouTube Embed Player */
              <div className="relative w-full h-full max-h-[62vh] bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${activeYoutubeId}?autoplay=1&rel=0`}
                  title={activeTitle}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Metadata & Telemetry Strip (Fixed Height, never cropped) */}
        <div className="px-4 py-2.5 sm:px-6 sm:py-3 bg-black/80 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="max-w-md sm:max-w-xl min-w-0">
            <p className="text-ink-200 line-clamp-1 leading-snug">{activeDescription}</p>
            <p className="text-[10px] text-ink-400 mt-0.5 font-mono truncate">
              Director: <span className="text-gold-300">{activeDirector}</span> · {activeQuality} · {activeDuration}
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono shrink-0">
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-ink-300">
              Dolby Atmos 7.1
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-gold-400">
              3D LUT
            </span>
            {sourceMode === "youtube" && (
              <button
                type="button"
                onClick={() => setSourceMode("direct")}
                className="px-2.5 py-1 rounded bg-gold-400/20 text-gold-300 border border-gold-400/40 hover:bg-gold-400 hover:text-ink-950 transition-colors cursor-pointer"
              >
                Switch to 4K Direct Stream
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
