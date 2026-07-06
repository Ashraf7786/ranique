import Link from 'next/link';
import { Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-brand-sand">
      <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="relative w-32 h-32 mx-auto flex items-center justify-center bg-brand-mist rounded-full shadow-inner">
          <Search className="w-16 h-16 text-brand-rose animate-bounce" />
          <div className="absolute inset-0 border-4 border-brand-rose/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
        </div>
        
        <h1 className="text-6xl font-serif font-bold text-brand-ink tracking-tight">404</h1>
        <h2 className="text-2xl font-serif font-medium text-brand-ink">Page not found</h2>
        
        <p className="text-gray-600 max-w-md mx-auto">
          We're sorry, but the page you were looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>
        
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/"
            className="px-8 py-3 bg-brand-ink text-white font-medium rounded-full hover:bg-gray-900 transition-colors shadow-sm"
          >
            Back to Home
          </Link>
          <Link 
            href="/shop"
            className="px-8 py-3 bg-white text-brand-ink font-medium rounded-full border border-gray-200 hover:border-brand-rose hover:text-brand-rose transition-colors shadow-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
