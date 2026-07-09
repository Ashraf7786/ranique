"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Instagram } from "lucide-react";

const REELS = [
  { id: 1, videoUrl: "/video/Ranique_reel1.mp4", title: "Earning Gift Box", instagramUrl: "https://www.instagram.com/reel/DaU1_9czYPo/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
  { id: 2, videoUrl: "/video/ranique_reel2.mp4", title: "Opening Ranique", instagramUrl: "https://www.instagram.com/reel/DaYQyT2zqEu/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
  { id: 3, videoUrl: "/video/Ranique_reel3.mp4", title: "Bangles", instagramUrl: "https://www.instagram.com/reel/Daj5aKBzXtp/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
  { id: 4, videoUrl: "/video/Ranique_reel4.mp4", title: "Jhumka", instagramUrl: "https://www.instagram.com/reel/DacgIv8zmZi/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
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
          video.play().catch(() => { }); // catch auto-play restrictions
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
      preload="none"
      disablePictureInPicture
      controlsList="nodownload noplaybackrate"
      className="w-full h-full object-cover scale-105 group-hover/reel:scale-100 transition-transform duration-700 pointer-events-none"
    />
  );
}

function ReelCard({ reel }: { reel: any }) {
  return (
    <a
      href={reel.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative shrink-0 w-[calc(50%-4px)] md:w-[calc(20%-12.8px)] aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer group/reel shadow-sm hover:shadow-card-hover transition-all bg-brand-mist snap-start"
      onContextMenu={(e) => e.preventDefault()} // Security: Prevent right-click to save
    >
      <ReelVideo src={reel.videoUrl} />

      {/* Overlay blocks right-clicks on the video underneath */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-80 group-hover/reel:opacity-100 transition-opacity" />

      {/* View on Instagram Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/reel:opacity-100 transition-opacity duration-300 z-10">
        <div className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transform translate-y-4 group-hover/reel:translate-y-0 transition-all duration-300 shadow-xl">
          <Instagram className="w-4 h-4" />
          View on Instagram
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white pointer-events-none z-10">
        <span className="font-sans font-medium text-sm truncate drop-shadow-md">{reel.title}</span>
      </div>
    </a>
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
