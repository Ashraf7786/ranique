"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Play } from "lucide-react";

export default function LaunchPage() {
  const [status, setStatus] = useState<"IDLE" | "COUNTDOWN" | "LAUNCHED">("IDLE");
  const [count, setCount] = useState(10);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "COUNTDOWN" && count > 0) {
      timer = setTimeout(() => setCount((c) => c - 1), 1000);
    } else if (status === "COUNTDOWN" && count === 0) {
      // Small delay to ensure 0 is seen briefly before launch
      setTimeout(() => setStatus("LAUNCHED"), 500);
    }
    return () => clearTimeout(timer);
  }, [status, count]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-brand-ink text-white font-sans selection:bg-brand-rose selection:text-white">
      
      {/* ─── STYLES FOR ANIMATIONS ─── */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .sparkle-1 { animation: twinkle 2s infinite ease-in-out; }
        .sparkle-2 { animation: twinkle 2.5s infinite ease-in-out 0.5s; }
        .sparkle-3 { animation: twinkle 1.8s infinite ease-in-out 1s; }
        .sparkle-4 { animation: twinkle 2.2s infinite ease-in-out 0.2s; }
        .sparkle-5 { animation: twinkle 2.7s infinite ease-in-out 0.8s; }

        @keyframes float-up {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-float-up {
          animation: float-up 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        
        .curtain-left {
          transform-origin: left;
          transition: transform 2.5s cubic-bezier(0.7, 0, 0.3, 1);
        }
        .curtain-right {
          transform-origin: right;
          transition: transform 2.5s cubic-bezier(0.7, 0, 0.3, 1);
        }
        .curtains-open .curtain-left {
          transform: translateX(-100%) scaleX(1.1);
        }
        .curtains-open .curtain-right {
          transform: translateX(100%) scaleX(1.1);
        }
      `}} />

      {/* ─── BACKGROUND GLOW ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-rose/20 rounded-full blur-[120px] mix-blend-screen opacity-50 transition-opacity duration-1000" />
      </div>

      {/* ─── STAGE CONTENT (Behind the curtain) ─── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
        {status === "LAUNCHED" && (
          <div className="text-center w-full max-w-4xl relative">
            
            {/* Sparkles Decoration */}
            <div className="absolute -top-12 -left-8 text-yellow-400 sparkle-1">
              <Sparkles className="w-10 h-10" strokeWidth={1} />
            </div>
            <div className="absolute top-10 -right-12 text-brand-rose sparkle-2">
              <Sparkles className="w-12 h-12" strokeWidth={1} />
            </div>
            <div className="absolute bottom-10 -left-16 text-white sparkle-3">
              <Sparkles className="w-8 h-8" strokeWidth={1} />
            </div>
            <div className="absolute -bottom-16 right-10 text-yellow-300 sparkle-4">
              <Sparkles className="w-14 h-14" strokeWidth={1} />
            </div>
            <div className="absolute -top-24 right-1/4 text-brand-rose sparkle-5">
              <Sparkles className="w-6 h-6" strokeWidth={1} />
            </div>

            <div className="animate-float-up opacity-0" style={{ animationDelay: '0.5s' }}>
              <p className="text-brand-rose font-bold tracking-[0.3em] uppercase text-sm md:text-base mb-6 flex items-center justify-center gap-3">
                <span className="w-12 h-px bg-brand-rose/50" />
                Congratulations
                <span className="w-12 h-px bg-brand-rose/50" />
              </p>
            </div>

            <div className="animate-float-up opacity-0" style={{ animationDelay: '0.8s' }}>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-brand-mist to-white mb-6 tracking-tight leading-tight">
                RANIQUE IS LIVE
              </h1>
            </div>
            
            <div className="animate-float-up opacity-0" style={{ animationDelay: '1.2s' }}>
              <h2 className="text-xl md:text-3xl font-light text-gray-300 mb-12 tracking-wide font-serif italic">
                On the Web App
              </h2>
            </div>

            <div className="animate-float-up opacity-0 flex justify-center" style={{ animationDelay: '1.8s' }}>
              <a 
                href="/"
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-brand-rose text-white rounded-full font-medium tracking-wide text-sm md:text-base overflow-hidden hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(200,90,110,0.4)]"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 font-bold">Enter The Store</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* ─── CURTAINS ─── */}
      <div 
        className={`absolute inset-0 z-40 flex pointer-events-none overflow-hidden ${
          status === "LAUNCHED" ? "curtains-open" : ""
        }`}
      >
        {/* Left Curtain */}
        <div className="curtain-left w-1/2 h-full relative bg-gradient-to-r from-[#111] to-[#1a1a1a] border-r border-[#333] shadow-[20px_0_50px_rgba(0,0,0,0.8)] z-50 overflow-hidden flex items-center justify-end">
          {/* Subtle curtain folds */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 mix-blend-overlay" />
          <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-black/60 to-transparent" />
        </div>

        {/* Right Curtain */}
        <div className="curtain-right w-1/2 h-full relative bg-gradient-to-l from-[#111] to-[#1a1a1a] border-l border-[#333] shadow-[-20px_0_50px_rgba(0,0,0,0.8)] z-50 overflow-hidden flex items-center justify-start">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 mix-blend-overlay" />
          <div className="absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-black/60 to-transparent" />
        </div>

        {/* Center Lock / Badge (Visible only when closed) */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] transition-opacity duration-700 ${status === "LAUNCHED" ? "opacity-0 scale-150" : "opacity-100"}`}>
          <div className="w-32 h-32 md:w-48 md:h-48 bg-brand-ink border border-brand-border rounded-full flex items-center justify-center shadow-2xl p-2 relative">
            <div className="absolute inset-0 rounded-full border border-brand-rose/30 animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-2 rounded-full border border-dashed border-gray-600 animate-[spin_20s_linear_infinite_reverse]" />
            
            <div className="w-full h-full bg-[#111] rounded-full flex flex-col items-center justify-center text-center">
               <span className="font-serif font-bold text-2xl md:text-3xl text-brand-rose tracking-wider">RANIQUE</span>
               <span className="text-[10px] md:text-xs tracking-[0.2em] text-gray-400 mt-1 uppercase">Exclusive</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── FOREGROUND CONTROLS (Only visible before launch) ─── */}
      <div 
        className={`absolute inset-0 z-[70] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-1000 ${
          status === "LAUNCHED" ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {status === "IDLE" && (
          <button 
            onClick={() => setStatus("COUNTDOWN")}
            className="group relative flex items-center gap-4 px-10 py-5 bg-white text-black rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-all duration-300 shadow-[0_0_50px_rgba(255,255,255,0.2)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-brand-rose translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <Play className="w-6 h-6 relative z-10 group-hover:text-white transition-colors" fill="currentColor" />
            <span className="relative z-10 group-hover:text-white transition-colors text-lg">Go Live</span>
          </button>
        )}

        {status === "COUNTDOWN" && (
          <div className="flex flex-col items-center">
            <span className="text-gray-400 uppercase tracking-[0.3em] text-sm md:text-base font-bold mb-8">
              Initiating Launch Sequence
            </span>
            <div className="text-[12rem] md:text-[16rem] font-serif font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 tabular-nums">
              {count}
            </div>
            
            {/* Countdown Progress Ring */}
            <svg className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] -rotate-90 pointer-events-none opacity-50">
              <circle 
                cx="50%" 
                cy="50%" 
                r="48%" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                className="text-gray-800"
              />
              <circle 
                cx="50%" 
                cy="50%" 
                r="48%" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeDasharray="1000"
                strokeDashoffset={1000 - (1000 * count) / 10}
                className="text-brand-rose transition-all duration-1000 ease-linear"
              />
            </svg>
          </div>
        )}
      </div>

    </div>
  );
}
