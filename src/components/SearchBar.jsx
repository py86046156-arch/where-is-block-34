import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  MapPin, 
  Building2, 
  Layers, 
  DoorOpen, 
  Compass, 
  Star, 
  ArrowRight,
  CornerDownLeft
} from 'lucide-react';

export default function SearchBar({
  nodes = [],
  rooms = [],
  onSelectDestination,
  onSelectRoom,
  onSelectStart,
  favorites = [],
  onToggleFavorite,
  recentSearches = [],
  onAddRecentSearch,
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'block' | 'room' | 'gate' | 'landmark'
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter items matching query
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    // When query is empty, show curated suggestions
    if (!q) {
      const topBlocks = nodes
        .filter(n => n.category === 'block' && (n.isHeroBlock || n.code === '34' || n.code === '28' || n.code === '25'))
        .map(node => ({
          type: 'node',
          id: node.id,
          title: node.name,
          subtitle: `${node.zone} • Academic Block`,
          category: 'block',
          raw: node,
          nodeId: node.id,
          isTrending: true,
        }));

      const topGates = nodes
        .filter(n => n.category === 'gate')
        .slice(0, 2)
        .map(node => ({
          type: 'node',
          id: node.id,
          title: node.name,
          subtitle: `${node.zone} • Entry Gate`,
          category: 'gate',
          raw: node,
          nodeId: node.id,
          isTrending: true,
        }));

      const topRooms = rooms
        .filter(r => r.id === '34-205' || r.id === '34-105')
        .map(room => ({
          type: 'room',
          id: `room-${room.id}`,
          title: `${room.roomNumber} — ${room.name}`,
          subtitle: `Block ${room.blockNumber} • ${room.floorName}`,
          category: 'room',
          raw: room,
          nodeId: room.blockId,
          roomId: room.id,
          isTrending: true,
        }));

      const combined = [...topBlocks, ...topRooms, ...topGates];
      return activeFilter === 'all' 
        ? combined 
        : combined.filter(item => item.category === activeFilter);
    }

    const matchedNodes = nodes
      .filter(node => 
        node.name.toLowerCase().includes(q) ||
        node.code.toLowerCase().includes(q) ||
        node.category.toLowerCase().includes(q) ||
        (node.description && node.description.toLowerCase().includes(q)) ||
        (node.facilities && node.facilities.some(f => f.toLowerCase().includes(q)))
      )
      .map(node => ({
        type: 'node',
        id: node.id,
        title: node.name,
        subtitle: `${node.zone} • ${node.category === 'block' ? 'Academic Block' : node.category === 'gate' ? 'Campus Gate' : 'Landmark'}`,
        category: node.category,
        raw: node,
        nodeId: node.id,
      }));

    const matchedRooms = rooms
      .filter(room =>
        room.roomNumber.toLowerCase().includes(q) ||
        room.name.toLowerCase().includes(q) ||
        room.blockNumber.toLowerCase().includes(q) ||
        room.category.toLowerCase().includes(q) ||
        (room.description && room.description.toLowerCase().includes(q))
      )
      .map(room => ({
        type: 'room',
        id: `room-${room.id}`,
        title: `${room.roomNumber} — ${room.name}`,
        subtitle: `Block ${room.blockNumber} • ${room.floorName} (${room.category.toUpperCase()})`,
        category: 'room',
        raw: room,
        nodeId: room.blockId,
        roomId: room.id,
      }));

    const allMatches = [...matchedNodes, ...matchedRooms];
    const filtered = activeFilter === 'all' 
      ? allMatches 
      : allMatches.filter(item => item.category === activeFilter);

    return filtered.slice(0, 10);
  }, [query, nodes, rooms, activeFilter]);

  const handleSelectItem = (item) => {
    if (onAddRecentSearch) {
      onAddRecentSearch(item.title);
    }
    if (item.type === 'room') {
      if (onSelectRoom) onSelectRoom(item.raw);
      if (onSelectDestination) onSelectDestination(item.nodeId);
    } else {
      if (onSelectDestination) onSelectDestination(item.nodeId);
    }
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e) => {
    if (!isOpen || searchResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % searchResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults[selectedIndex]) {
        handleSelectItem(searchResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'block':
        return <Building2 className="w-4 h-4 text-[#635BFF]" />;
      case 'room':
        return <Layers className="w-4 h-4 text-purple-600" />;
      case 'gate':
        return <DoorOpen className="w-4 h-4 text-emerald-600" />;
      default:
        return <Compass className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      {/* Primary Search Bar Container */}
      <div 
        className={`relative flex items-center bg-white rounded-2xl border transition-all duration-200 shadow-sm ${
          isOpen 
            ? 'border-[#635BFF] ring-4 ring-[#635BFF]/10 shadow-lg' 
            : 'border-[#E8EAF2] hover:border-slate-300 shadow-slate-200/50'
        }`}
      >
        {/* Leading Search Icon */}
        <div className="pl-4 pr-2 text-[#94A3B8] flex items-center pointer-events-none">
          <Search className="w-5 h-5" />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Where would you like to go? Try Block 34 or Room 304-205"
          className="w-full py-4 text-sm sm:text-base font-normal text-[#0F172A] placeholder-[#94A3B8] bg-transparent focus:outline-none"
        />

        {/* Trailing Controls: Campus indicator & Clear button */}
        <div className="pr-3 flex items-center gap-2">
          {query ? (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1.5 text-[#94A3B8] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-medium text-[#64748B]">
              <MapPin className="w-3 h-3 text-[#635BFF]" />
              <span>LPU Campus</span>
            </div>
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-[#E8EAF2] rounded-2xl shadow-xl z-50 overflow-hidden animate-fadeIn">
          {/* Category Filter Pills */}
          <div className="px-3 pt-3 pb-2 border-b border-[#E8EAF2] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Destinations' },
              { id: 'block', label: 'Blocks' },
              { id: 'room', label: 'Rooms & Labs' },
              { id: 'gate', label: 'Gates' },
              { id: 'landmark', label: 'Landmarks' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeFilter === f.id
                    ? 'bg-[#635BFF] text-white shadow-xs'
                    : 'bg-slate-100 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200/70'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto py-1">
            {searchResults.length > 0 ? (
              searchResults.map((item, index) => {
                const isSelected = index === selectedIndex;
                const isFav = favorites.includes(item.id) || favorites.includes(item.nodeId);

                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => handleSelectItem(item)}
                    className={`px-4 py-3 cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                      isSelected ? 'bg-[#F3F0FF]/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-xl bg-slate-100 flex-shrink-0">
                        {getCategoryIcon(item.category)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#0F172A] truncate">
                            {item.title}
                          </span>
                          {item.raw?.isHeroBlock && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-orange-100 text-orange-700">
                              Hero
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#64748B] truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {/* Set as Start Action */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectStart) onSelectStart(item.nodeId);
                          setIsOpen(false);
                        }}
                        className="hidden sm:inline-flex px-2 py-1 rounded-lg text-[11px] font-medium text-[#64748B] hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                        title="Set as your starting point"
                      >
                        Set Start
                      </button>

                      {/* Favorite Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onToggleFavorite) onToggleFavorite(item.id);
                        }}
                        className="p-1.5 text-slate-300 hover:text-amber-400 transition-colors"
                        title="Save to favorites"
                      >
                        <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>

                      <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-[#635BFF] translate-x-0.5' : 'text-slate-300'}`} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-6 py-8 text-center text-sm text-[#64748B]">
                <p className="font-medium text-[#0F172A]">No destinations match "{query}"</p>
                <p className="text-xs text-[#94A3B8] mt-1">Try searching for "Block 34", "Gate 1", or "Seminar Hall"</p>
              </div>
            )}
          </div>

          {/* Keyboard shortcut hint bar */}
          <div className="px-4 py-2 bg-slate-50 border-t border-[#E8EAF2] flex items-center justify-between text-[11px] text-[#94A3B8]">
            <span>Navigate with <kbd className="px-1 py-0.5 rounded bg-white border border-[#E8EAF2] font-mono text-[10px]">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-white border border-[#E8EAF2] font-mono text-[10px]">↓</kbd></span>
            <span className="flex items-center gap-1">Select <CornerDownLeft className="w-3 h-3" /></span>
          </div>
        </div>
      )}
    </div>
  );
}
