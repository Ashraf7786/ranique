"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";
import { cn } from "@/lib/utils";

const REELS = [
  { id: 1, videoUrl: "/video/Ranique_reel1.mp4", title: "Summer Glow Up" },
  { id: 2, videoUrl: "/video/Ranique_reel2.MOV", title: "Accessories Haul" },
  { id: 3, videoUrl: "/video/Ranique_reel1.mp4", title: "Behind the Scenes" },
  { id: 4, videoUrl: "/video/Ranique_reel2.MOV", title: "New Arrivals" },
];

export function ReelsSection() {
  const [activeReel, setActiveReel] = useState<string | null>(null);

  return (
    <section aria-label="Reels" className="py-16 bg-brand-mist/20 overflow-hidden border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
         <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-ink">
           Ranique on Reels
         </h2>
         <p className="text-brand-slate text-sm mt-1">Watch our latest styles in motion</p>
      </div>

      <div className="relative group flex overflow-hidden w-full">
         <div className="flex gap-4 px-4 w-max animate-reel-slide group-hover:[animation-play-state:paused]">
           {[...REELS, ...REELS, ...REELS, ...REELS].map((reel, idx) => (
             <div 
               key={`${reel.id}-${idx}`}
               className="relative shrink-0 w-[200px] h-[350px] sm:w-[240px] sm:h-[420px] rounded-2xl overflow-hidden cursor-pointer group/reel shadow-sm hover:shadow-card-hover transition-all bg-brand-mist"
               onClick={() => setActiveReel(reel.videoUrl)}
             >
               <video 
                 src={reel.videoUrl} 
                 autoPlay 
                 muted 
                 loop 
                 playsInline
                 className="w-full h-full object-cover scale-105 group-hover/reel:scale-100 transition-transform duration-700"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-80 group-hover/reel:opacity-100 transition-opacity" />
               <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
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
