"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Ruler, Sparkles, AlertCircle, Info } from "lucide-react";

type Tab = "bangles" | "rings";

export default function SizeGuidePage() {
  const [activeTab, setActiveTab] = useState<Tab>("bangles");

  return (
    <div className="min-h-screen bg-brand-sand/30 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-ink mb-4">Size Guide</h1>
          <p className="text-gray-600 max-w-lg mx-auto text-lg">
            Find your perfect fit. Follow our simple instructions to measure your size accurately from the comfort of your home.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white p-1.5 rounded-full border border-gray-200 shadow-sm">
            <button
              onClick={() => setActiveTab("bangles")}
              className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === "bangles"
                  ? "bg-brand-rose text-white shadow-md"
                  : "text-gray-600 hover:text-brand-ink hover:bg-gray-50"
              }`}
            >
              Bangles
            </button>
            <button
              onClick={() => setActiveTab("rings")}
              className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === "rings"
                  ? "bg-brand-rose text-white shadow-md"
                  : "text-gray-600 hover:text-brand-ink hover:bg-gray-50"
              }`}
            >
              Rings
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* BANGLES SECTION */}
          {activeTab === "bangles" && (
            <div className="p-8 sm:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col lg:flex-row gap-12 items-start">
                
                {/* How to Measure Text */}
                <div className="flex-1 space-y-8">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-brand-ink mb-4 flex items-center gap-2">
                      <Ruler className="w-6 h-6 text-brand-rose" />
                      How to Measure Bangle Size
                    </h2>
                    <div className="space-y-4 text-gray-600 leading-relaxed">
                      <p>
                        <strong className="text-brand-ink">Method 1: Measure an existing bangle</strong><br />
                        Take a bangle that fits you perfectly. Place a ruler across the center to measure its inner diameter in inches or millimeters. Match the measurement to our size chart below.
                      </p>
                      <p>
                        <strong className="text-brand-ink">Method 2: Measure your hand</strong><br />
                        Bring your thumb and little finger together, as if you were putting on a bangle. Wrap a string or measuring tape around the widest part of your hand (the knuckles). Measure the length of the string and compare it to the circumference in our chart.
                      </p>
                    </div>
                  </div>

                  <div className="bg-brand-blush/20 p-5 rounded-2xl border border-brand-rose/20 flex gap-4 items-start">
                    <Info className="w-6 h-6 text-brand-rose shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">
                      <strong>Pro Tip:</strong> If your measurement falls between two sizes, we recommend choosing the larger size for a comfortable fit.
                    </p>
                  </div>
                </div>

                {/* Illustration Image */}
                <div className="w-full lg:w-[400px] shrink-0 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="aspect-square relative rounded-xl overflow-hidden bg-white shadow-sm">
                    <Image 
                      src="/images/bangle_size_guide.png" 
                      alt="Bangle Size Guide Illustration" 
                      fill 
                      className="object-contain p-4"
                      unoptimized
                    />
                  </div>
                </div>
              </div>

              {/* Size Chart Table */}
              <div className="mt-16">
                <h3 className="text-xl font-bold text-brand-ink mb-6 text-center">Bangle Size Chart (Indian Standards)</h3>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-brand-ink font-semibold border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4">Indian Size (Aana)</th>
                        <th className="px-6 py-4">Inner Diameter (inches)</th>
                        <th className="px-6 py-4">Inner Diameter (mm)</th>
                        <th className="px-6 py-4">Circumference (inches)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-brand-rose">2.2</td>
                        <td className="px-6 py-4">2.12"</td>
                        <td className="px-6 py-4">54.0 mm</td>
                        <td className="px-6 py-4">6.67"</td>
                      </tr>
                      <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-brand-rose">2.4</td>
                        <td className="px-6 py-4">2.25"</td>
                        <td className="px-6 py-4">57.0 mm</td>
                        <td className="px-6 py-4">7.06"</td>
                      </tr>
                      <tr className="hover:bg-gray-50/50 transition-colors bg-brand-gold-light/10">
                        <td className="px-6 py-4 font-bold text-brand-rose flex items-center gap-2">
                          2.6 <span className="text-[10px] bg-brand-gold text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Most Common</span>
                        </td>
                        <td className="px-6 py-4">2.37"</td>
                        <td className="px-6 py-4">60.0 mm</td>
                        <td className="px-6 py-4">7.45"</td>
                      </tr>
                      <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-brand-rose">2.8</td>
                        <td className="px-6 py-4">2.50"</td>
                        <td className="px-6 py-4">63.0 mm</td>
                        <td className="px-6 py-4">7.85"</td>
                      </tr>
                      <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-brand-rose">2.10</td>
                        <td className="px-6 py-4">2.62"</td>
                        <td className="px-6 py-4">66.7 mm</td>
                        <td className="px-6 py-4">8.24"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* RINGS SECTION */}
          {activeTab === "rings" && (
            <div className="p-8 sm:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col lg:flex-row gap-12 items-start">
                
                {/* How to Measure Text */}
                <div className="flex-1 space-y-8">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-brand-ink mb-4 flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-brand-rose" />
                      How to Measure Ring Size
                    </h2>
                    <div className="space-y-4 text-gray-600 leading-relaxed">
                      <p>
                        <strong className="text-brand-ink">Method 1: Measure your finger</strong><br />
                        Wrap a piece of string or a thin strip of paper around the base of the finger you want to measure. Mark where the string overlaps. Measure the length with a ruler in millimeters (this is the circumference).
                      </p>
                      <p>
                        <strong className="text-brand-ink">Method 2: Use an existing ring</strong><br />
                        Take a ring that fits perfectly on your desired finger. Measure the internal diameter using a ruler (in mm) and match it against our chart below.
                      </p>
                    </div>
                  </div>

                  <div className="bg-brand-sand/50 p-5 rounded-2xl border border-brand-gold-light flex gap-4 items-start">
                    <AlertCircle className="w-6 h-6 text-brand-gold shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">
                      <strong>Important:</strong> Your finger size can change throughout the day based on temperature. For the most accurate result, measure your finger at the end of the day when it is warm.
                    </p>
                  </div>
                </div>

                {/* Illustration Image */}
                <div className="w-full lg:w-[400px] shrink-0 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="aspect-square relative rounded-xl overflow-hidden bg-white shadow-sm">
                    <Image 
                      src="/images/ring_size_guide.png" 
                      alt="Ring Size Guide Illustration" 
                      fill 
                      className="object-contain p-4"
                      unoptimized
                    />
                  </div>
                </div>
              </div>

              {/* Size Chart Table */}
              <div className="mt-16">
                <h3 className="text-xl font-bold text-brand-ink mb-6 text-center">Ring Size Chart (Indian Standards)</h3>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-brand-ink font-semibold border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4">Indian Size</th>
                        <th className="px-6 py-4">US Size</th>
                        <th className="px-6 py-4">Inner Diameter (mm)</th>
                        <th className="px-6 py-4">Circumference (mm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-brand-rose">10</td>
                        <td className="px-6 py-4">5.5</td>
                        <td className="px-6 py-4">16.0 mm</td>
                        <td className="px-6 py-4">50.3 mm</td>
                      </tr>
                      <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-brand-rose">12</td>
                        <td className="px-6 py-4">6.0</td>
                        <td className="px-6 py-4">16.5 mm</td>
                        <td className="px-6 py-4">51.8 mm</td>
                      </tr>
                      <tr className="hover:bg-gray-50/50 transition-colors bg-brand-gold-light/10">
                        <td className="px-6 py-4 font-bold text-brand-rose">14</td>
                        <td className="px-6 py-4">7.0</td>
                        <td className="px-6 py-4">17.3 mm</td>
                        <td className="px-6 py-4">54.4 mm</td>
                      </tr>
                      <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-brand-rose">16</td>
                        <td className="px-6 py-4">7.5</td>
                        <td className="px-6 py-4">17.8 mm</td>
                        <td className="px-6 py-4">56.0 mm</td>
                      </tr>
                      <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-brand-rose">18</td>
                        <td className="px-6 py-4">8.5</td>
                        <td className="px-6 py-4">18.5 mm</td>
                        <td className="px-6 py-4">58.3 mm</td>
                      </tr>
                      <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-brand-rose">20</td>
                        <td className="px-6 py-4">9.5</td>
                        <td className="px-6 py-4">19.3 mm</td>
                        <td className="px-6 py-4">60.6 mm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Support Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Still unsure about your size? We'd love to help!</p>
          <div className="flex gap-4 justify-center">
            <Link href="/contact" className="inline-flex bg-brand-ink text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-900 transition-colors shadow-sm">
              Contact Support
            </Link>
            <a href="https://wa.me/919288467633" target="_blank" rel="noopener noreferrer" className="inline-flex bg-white text-brand-ink border border-gray-200 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm">
              WhatsApp Us
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
