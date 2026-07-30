"use client";

import { useState, useEffect } from "react";
import { X, Mail, Gift, ArrowRight, Copy, Check } from "lucide-react";

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if user has seen popup before
    const hasSeenPopup = localStorage.getItem("hasSeenWelcomePopup");
    
    if (!hasSeenPopup) {
      // Show popup after 5 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenWelcomePopup", "true");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    
    // In a real app, you would send this to your newsletter API here
    // e.g. await subscribeToNewsletter(email);
    
    setIsUnlocked(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText("WELCOME10");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 text-brand-ink transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col">
          {/* Header Image/Pattern Area */}
          <div className="relative h-40 sm:h-48 bg-gradient-to-br from-brand-blush to-brand-gold-light/40 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#C9748A 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
            
            <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full shadow-md flex items-center justify-center text-brand-rose">
              <Gift className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 sm:p-8 text-center">
            
            {!isUnlocked ? (
              // Form State
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-ink mb-2">
                  Welcome to Ranique!
                </h2>
                <p className="font-sans text-sm sm:text-base text-brand-slate mb-6">
                  Unlock <span className="font-semibold text-brand-rose">10% OFF</span> your first order by joining our exclusive email list.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-brand-slate/60" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-brand-mist border border-brand-border rounded-xl text-brand-ink font-sans text-sm focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose transition-all"
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full py-3.5 bg-brand-ink hover:bg-black text-white rounded-xl font-sans font-semibold text-sm transition-all flex items-center justify-center gap-2 group"
                  >
                    Unlock My 10% Off
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>

                <button 
                  onClick={handleClose}
                  className="mt-5 text-xs text-brand-slate hover:text-brand-ink underline underline-offset-2 transition-colors"
                >
                  No thanks, I prefer paying full price
                </button>
              </div>
            ) : (
              // Success State
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-ink mb-2">
                  You're in! 🎉
                </h2>
                <p className="font-sans text-sm sm:text-base text-brand-slate mb-6">
                  Use the code below at checkout to get 10% off your entire first order.
                </p>

                <div className="relative p-1 rounded-xl bg-gradient-to-r from-brand-rose to-brand-gold">
                  <div className="bg-white rounded-lg p-5 flex flex-col items-center gap-3">
                    <span className="font-sans text-xs font-semibold text-brand-slate uppercase tracking-widest">
                      Your Discount Code
                    </span>
                    <span className="font-serif text-3xl sm:text-4xl font-bold text-brand-ink tracking-wider">
                      WELCOME10
                    </span>
                    
                    <button
                      onClick={copyToClipboard}
                      className="mt-2 flex items-center gap-2 px-6 py-2.5 bg-brand-mist hover:bg-brand-mist/80 text-brand-ink rounded-full font-sans text-sm font-medium transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleClose}
                  className="mt-6 w-full py-3.5 bg-brand-ink hover:bg-black text-white rounded-xl font-sans font-semibold text-sm transition-all"
                >
                  Start Shopping
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
