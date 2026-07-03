"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface ProductTabsProps {
  tabs: Tab[];
}

export function ProductTabs({ tabs }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "");

  return (
    <div>
      {/* Tab headers */}
      <div
        role="tablist"
        aria-label="Product details"
        className="flex border-b border-brand-border"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative px-4 pb-3 pt-1 font-sans text-sm font-medium",
                "transition-colors duration-150 whitespace-nowrap",
                isActive
                  ? "text-brand-rose"
                  : "text-brand-slate hover:text-brand-ink"
              )}
            >
              {tab.label}
              {/* Animated underline indicator */}
              <span
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-brand-rose",
                  "transition-all duration-200",
                  isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                )}
                style={{ transformOrigin: "center" }}
              />
            </button>
          );
        })}
      </div>

      {/* Tab panels */}
      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`tabpanel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== tab.id}
          className="pt-5 animate-fade-in"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
