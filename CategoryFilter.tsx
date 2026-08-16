import React from 'react';
import { DEFAULT_FILTER_CONFIG } from '../data';
import { Category } from '../types';
import { SlidersHorizontal } from 'lucide-react';

interface CategoryFilterProps {
  categories?: string[];
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  ripenessLabel?: string;
  ripenessFilters?: string[];
  selectedRipeness: string;
  setSelectedRipeness: (r: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories = DEFAULT_FILTER_CONFIG.categories,
  selectedCategory,
  setSelectedCategory,
  ripenessLabel = DEFAULT_FILTER_CONFIG.ripenessLabel,
  ripenessFilters = DEFAULT_FILTER_CONFIG.ripenessFilters,
  selectedRipeness,
  setSelectedRipeness,
}) => {
  return (
    <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#0ea5e9]/20">
        {/* Dynamic Category Tabs */}
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-none font-sans text-xs uppercase tracking-widest">
          {categories.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase() || 
                             (cat === 'All' && selectedCategory === 'All');
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all whitespace-nowrap font-semibold cursor-pointer shadow-2xs ${
                  isActive
                    ? 'bg-[#0f172a] text-white shadow-md scale-102'
                    : 'bg-white text-[#78350f] hover:bg-[#0ea5e9]/10 hover:text-[#0f172a] border border-[#0ea5e9]/30'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Dynamic Ripeness Filter Dropdown */}
        <div className="flex items-center gap-2.5 self-start md:self-auto font-sans text-xs uppercase tracking-wider shrink-0">
          <div className="flex items-center gap-1.5 text-[#78350f] font-semibold">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#0ea5e9]" />
            <span>{ripenessLabel || 'Ripeness:'}</span>
          </div>
          <select
            value={selectedRipeness}
            onChange={(e) => setSelectedRipeness(e.target.value)}
            className="px-4 py-2 bg-white border border-[#0ea5e9]/30 rounded-full text-xs font-semibold text-[#0f172a] focus:outline-none focus:border-[#0ea5e9] shadow-2xs cursor-pointer uppercase tracking-wider"
          >
            {ripenessFilters.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
