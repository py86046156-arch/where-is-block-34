import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Building2, 
  DoorOpen, 
  Compass, 
  ArrowRight, 
  Filter, 
  CheckCircle2,
  Navigation,
  Star,
  Layers
} from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export default function DestinationsPage({
  nodes = [],
  favorites = [],
  onToggleFavorite,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name'); // 'name' | 'code' | 'zone'
  const navigate = useNavigate();

  const categories = [
    { id: 'all', label: 'All Destinations' },
    { id: 'block', label: 'Academic Blocks' },
    { id: 'gate', label: 'Campus Gates' },
    { id: 'landmark', label: 'Landmarks & Facilities' }
  ];

  const filteredAndSortedNodes = useMemo(() => {
    return nodes
      .filter(n => {
        const matchesCategory = selectedCategory === 'all' || n.category === selectedCategory;
        const q = searchQuery.toLowerCase();
        const matchesQuery = !q ||
          n.name.toLowerCase().includes(q) ||
          n.code.toLowerCase().includes(q) ||
          n.zone.toLowerCase().includes(q) ||
          (n.description && n.description.toLowerCase().includes(q)) ||
          (n.facilities && n.facilities.some(f => f.toLowerCase().includes(q)));
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'code') return a.code.localeCompare(b.code);
        if (sortBy === 'zone') return a.zone.localeCompare(b.zone);
        return 0;
      });
  }, [nodes, selectedCategory, searchQuery, sortBy]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'block':
        return <Building2 className="w-5 h-5 text-[#635BFF]" />;
      case 'gate':
        return <DoorOpen className="w-5 h-5 text-emerald-600" />;
      default:
        return <Compass className="w-5 h-5 text-sky-600" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8EAF2]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3F0FF] text-xs font-semibold text-[#635BFF] mb-2">
            <span>Campus Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
            Campus Destinations
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] mt-1">
            Search and explore academic blocks, entrance gates, labs, and essential facilities.
          </p>
        </div>

        <Link
          to="/map"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#635BFF] hover:bg-[#5145E5] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all self-start md:self-auto"
        >
          <Compass className="w-4 h-4" />
          <span>View on Map</span>
        </Link>
      </div>

      {/* Filter and Search Bar Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E8EAF2] shadow-xs">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blocks, gates, facilities..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-[#E8EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 text-[#0F172A]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#635BFF] text-white shadow-xs'
                  : 'bg-slate-100 text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
          <span className="text-xs text-[#94A3B8] hidden xl:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="py-1.5 px-2.5 bg-slate-50 border border-[#E8EAF2] rounded-xl text-xs font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20"
          >
            <option value="name">Name (A–Z)</option>
            <option value="code">Code / Number</option>
            <option value="zone">Campus Zone</option>
          </select>
        </div>

      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAndSortedNodes.map((node, index) => {
          const isFav = favorites.includes(node.id);

          return (
            <ScrollReveal key={node.id} direction="up" delay={Math.min(index * 40, 240)}>
              <div
                className="bg-white rounded-2xl border border-[#E8EAF2] hover:border-[#C7BDFF] shadow-sm hover:shadow-card-hover p-5 flex flex-col justify-between transition-all duration-200 group h-full"
              >
              <div>
                {/* Card Top: Category Icon & Badges */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F3F0FF] flex items-center justify-center flex-shrink-0">
                    {getCategoryIcon(node.category)}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {node.isHeroBlock && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700">
                        Hero Block
                      </span>
                    )}
                    <button
                      onClick={() => onToggleFavorite && onToggleFavorite(node.id)}
                      className="p-1.5 text-slate-300 hover:text-amber-400 rounded-lg transition-colors"
                      title="Save to favorites"
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Building Title */}
                <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#635BFF] transition-colors leading-snug">
                  {node.name}
                </h3>

                <div className="flex items-center gap-2 mt-1 text-xs text-[#64748B]">
                  <span className="font-medium text-[#635BFF]">{node.zone}</span>
                  <span>•</span>
                  <span>Code: {node.code}</span>
                  {node.floors && (
                    <>
                      <span>•</span>
                      <span>{node.floors} Floors</span>
                    </>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-[#64748B] mt-2.5 line-clamp-2 leading-relaxed">
                  {node.description}
                </p>

                {/* Facilities Tags */}
                {node.facilities && node.facilities.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {node.facilities.slice(0, 3).map((f, idx) => (
                      <span key={idx} className="text-[10px] font-medium text-[#64748B] bg-slate-100 px-2 py-0.5 rounded-md">
                        {f}
                      </span>
                    ))}
                    {node.facilities.length > 3 && (
                      <span className="text-[10px] text-[#94A3B8] px-1 py-0.5 font-medium">
                        +{node.facilities.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Card Actions */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  to={`/destinations/${node.id}`}
                  className="text-xs font-semibold text-[#64748B] hover:text-[#635BFF] transition-colors flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => navigate(`/map?dest=${node.id}`)}
                  className="px-3 py-1.5 bg-[#F3F0FF] hover:bg-[#635BFF] text-[#635BFF] hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </button>
              </div>
            </div>
          </ScrollReveal>
        );
      })}
      </div>

      {filteredAndSortedNodes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#E8EAF2] p-8">
          <MapPin className="w-10 h-10 text-[#94A3B8] mx-auto mb-2" />
          <h4 className="font-bold text-base text-[#0F172A]">No destinations found</h4>
          <p className="text-xs text-[#64748B] mt-1">
            Try adjusting your search query or switching to 'All Destinations'.
          </p>
        </div>
      )}

    </div>
  );
}
