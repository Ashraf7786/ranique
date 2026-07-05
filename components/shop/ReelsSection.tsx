"use client";

import { useState, useRef, useEffect } from "react";
import { Play, X } from "lucide-react";
import { cn } from "@/lib/utils";

const REELS = [
  { id: 1, videoUrl: "/video/Ranique_reel1.mp4", title: "Summer Glow Up" },
  { id: 2, videoUrl: "/video/Ranique_reel2.MOV", title: "Accessories Haul" },
  { id: 3, videoUrl: "/video/Ranique_reel1.mp4", title: "Behind the Scenes" },
  { id: 4, videoUrl: "/video/Ranique_reel2.MOV", title: "New Arrivals" },
];

function ReelVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Use IntersectionObserver to pause video when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {}); // catch auto-play restrictions
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      className="w-full h-full object-cover scale-105 group-hover/reel:scale-100 transition-transform duration-700"
    />
  );
}

export function ReelsSection() {
  const [activeReel, setActiveReel] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-scroll logic
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        
        // If we reach the end, snap back to start
        if (scrollLeft >= maxScroll - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section aria-label="Reels" className="py-16 bg-brand-mist/20 overflow-hidden border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-ink">
            Ranique on Reels
          </h2>
          <p className="text-brand-slate text-sm mt-1">Watch our latest styles in motion</p>
        </div>
        
        {/* Desktop Navigation Arrows */}
        <div className="hidden md:flex items-center gap-2">
          <button 
            onClick={scrollLeft}
            className="p-2 rounded-full bg-white border border-brand-border hover:border-brand-rose hover:text-brand-rose transition-colors shadow-sm"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button 
            onClick={scrollRight}
            className="p-2 rounded-full bg-white border border-brand-border hover:border-brand-rose hover:text-brand-rose transition-colors shadow-sm"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <div 
        className="relative group w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        <div 
          ref={scrollRef}
          className="flex gap-4 px-4 sm:px-6 lg:px-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Duplicate reels to ensure enough items to scroll through smoothly */}
          {[...REELS, ...REELS, ...REELS].map((reel, idx) => (
            <div
              key={`${reel.id}-${idx}`}
              className="relative shrink-0 w-[200px] h-[350px] sm:w-[240px] sm:h-[420px] rounded-2xl overflow-hidden cursor-pointer group/reel shadow-sm hover:shadow-card-hover transition-all bg-brand-mist snap-start"
              onClick={() => setActiveReel(reel.videoUrl)}
            >
              <ReelVideo src={reel.videoUrl} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-80 group-hover/reel:opacity-100 transition-opacity pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
                <span className="font-sans font-medium text-sm truncate drop-shadow-md">{reel.title}</span>
                <Play className="w-6 h-6 drop-shadow-md text-white/80 group-hover/reel:text-white transition-colors" fill="currentColor" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeReel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-in p-4 sm:p-8">
          <button
            onClick={() => setActiveReel(null)}
            className="absolute top-4 right-4 sm:top-8 sm:right-8 p-3 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 animate-slide-up">
            <video
              src={activeReel}
              autoPlay
              controls
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </section>
  );
}
