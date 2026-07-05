"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const REELS = [
  { id: 1, videoUrl: "/video/Ranique_reel1.mp4", title: "Summer Glow Up" },
  { id: 2, videoUrl: "/video/Ranique_reel2.MOV", title: "Accessories Haul" },
  { id: 3, videoUrl: "/video/Ranique_reel1.mp4", title: "Behind the Scenes" },
  { id: 4, videoUrl: "/video/Ranique_reel2.MOV", title: "New Arrivals" },
];

function ReelVideo({ src, isMuted }: { src: string; isMuted: boolean }) {
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

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      if (!isMuted) {
        // Attempt to play with sound when unmuted
        videoRef.current.play().catch(() => {
          // If browser blocks unmuted play without prior interaction, fallback to muted
          if (videoRef.current) videoRef.current.muted = true;
        });
      }
    }
  }, [isMuted]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      disablePictureInPicture
      controlsList="nodownload noplaybackrate"
      className="w-full h-full object-cover scale-105 group-hover/reel:scale-100 transition-transform duration-700 pointer-events-none"
    />
  );
}

function ReelCard({ reel }: { reel: any }) {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div
      className="relative shrink-0 w-[calc(50%-4px)] md:w-[calc(20%-12.8px)] aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer group/reel shadow-sm hover:shadow-card-hover transition-all bg-brand-mist snap-start"
      onMouseEnter={() => setIsMuted(false)}
      onMouseLeave={() => setIsMuted(true)}
      onClick={() => setIsMuted(!isMuted)} // Toggle sound on mobile tap
      onContextMenu={(e) => e.preventDefault()} // Security: Prevent right-click to save
    >
      <ReelVideo src={reel.videoUrl} isMuted={isMuted} />
      
      {/* Overlay blocks right-clicks on the video underneath */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-80 group-hover/reel:opacity-100 transition-opacity" />
      
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
        <span className="font-sans font-medium text-sm truncate drop-shadow-md">{reel.title}</span>
      </div>
    </div>
  );
}

export function ReelsSection() {
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
          // Slide by full visible width
          scrollRef.current.scrollBy({ left: clientWidth, behavior: "smooth" });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollRef.current.clientWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollRef.current.clientWidth, behavior: "smooth" });
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
        className="relative group w-full max-w-7xl mx-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        <div 
          ref={scrollRef}
          className="flex gap-2 md:gap-4 px-4 sm:px-6 lg:px-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* We duplicate REELS enough times so it can scroll for a long time */}
          {[...REELS, ...REELS, ...REELS, ...REELS, ...REELS].map((reel, idx) => (
            <ReelCard key={`${reel.id}-${idx}`} reel={reel} />
          ))}
        </div>
      </div>
    </section>
  );
}
