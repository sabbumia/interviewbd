// src/app/fields/_components/FieldsHeroHeader.tsx
import { Search, Layers } from 'lucide-react';

interface FieldsHeroHeaderProps {
  totalFields: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function FieldsHeroHeader({ 
  totalFields, 
  searchQuery, 
  onSearchChange 
}: FieldsHeroHeaderProps) {
  return (
    <div className="mx-auto relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden">    
    <div className="w-[58%] mx-auto relative overflow-hidden rounded-xl">    
      <div className="relative px-6 md:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
              Explore Interview <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Fields</span>
            </h1>
            <p className="text-gray-300 text-sm md:text-base">
              Choose your domain and master interview questions from industry experts
            </p>
          </div>
          
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Layers className="w-5 h-5 text-blue-400" />
              <p className="text-3xl font-bold text-white">{totalFields}</p>
            </div>
            <p className="text-xs text-gray-300 font-medium">Total Fields</p>
          </div>
        </div>
        
        {/* Advanced Search Bar */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition"></div>
          <div className="relative flex items-center">
            <div className="absolute left-5 pointer-events-none">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search fields by name or description..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 text-slate-900 placeholder-slate-400 font-medium"
            />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}