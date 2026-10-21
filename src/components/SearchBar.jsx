import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  MapPin, 
  Building2, 
  DoorOpen, 
  Sparkles, 
  Star, 
  Clock, 
  ArrowRight, 
  HelpCircle, 
  Layers, 
  Filter
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

  // Close dropdown when clicked outside
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
  const searchResults = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    
    // When query is empty, show curated suggestions
    if (!q) {
      const topBlocks = nodes.filter(n => n.category === 'block' && (n.isHeroBlock || n.code === '34' || n.code === '28' || n.code === '25')).map(node => ({
        type: 'node',
        id: node.id,
        title: node.name,
        subtitle: `${node.zone} • ${node.category.toUpperCase()}`,
        category: node.category,
        raw: node,
        nodeId: node.id,
        isTrending: true,
      }));

      const topGates = nodes.filter(n => n.category === 'gate').slice(0, 2).map(node => ({
        type: 'node',
        id: node.id,
        title: node.name,
        subtitle: `${node.zone} • GATE`,
        category: node.category,
        raw: node,
        nodeId: node.id,
        isTrending: true,
      }));

      const topRooms = rooms.filter(r => r.id === '34-205' || r.id === '34-105').map(room => ({
        type: 'room',
        id: `room-${room.id}`,
        title: `${room.roomNumber} - ${room.name}`,
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

    const matchedNodes = nodes.filter(node => 
      node.name.toLowerCase().includes(q) ||
      node.code.toLowerCase().includes(q) ||
      node.category.toLowerCase().includes(q) ||
      (node.description && node.description.toLowerCase().includes(q)) ||
      (node.facilities && node.facilities.some(f => f.toLowerCase().includes(q)))
    ).map(node => ({
      type: 'node',
      id: node.id,
      title: node.name,
      subtitle: `${node.zone} • ${node.category.toUpperCase()}`,
      category: node.category,
      raw: node,
      nodeId: node.id,
    }));

    const matchedRooms = rooms.filter(room =>
      room.roomNumber.toLowerCase().includes(q) ||
      room.name.toLowerCase().includes(q) ||
      room.blockNumber.toLowerCase().includes(q) ||
      room.category.toLowerCase().includes(q) ||
      (room.description && room.description.toLowerCase().includes(q))
    ).map(room => ({
      type: 'room',
      id: `room-${room.id}`,
      title: `${room.roomNumber} - ${room.name}`,
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

  const handleSelectDestination = (item) => {
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
  };

  const handleSelectStart = (e, item) => {
    e.stopPropagation();
    if (onSelectStart) {
      onSelectStart(item.nodeId);
      if (onAddRecentSearch) onAddRecentSearch(`Start: ${item.title}`);
    }
    setIsOpen(false);
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
        handleSelectDestination(searchResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'gate':
        return <DoorOpen className="w-4 h-4 text-emerald-600" />;
      case 'block':
        return <Building2 className="w-4 h-4 text-orange-600" />;
      case 'room':
        return <Layers className="w-4 h-4 text-purple-600" />;
      case 'landmark':
        return <Sparkles className="w-4 h-4 text-indigo-600" />;
      default:
        return <MapPin className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-3xl mx-auto">
      {/* Main Search Input Card */}
      <div className="relative flex items-center bg-white rounded-2xl shadow-xl border border-slate-200/90 hover:border-orange-300 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-100 transition-all duration-200">
        <div className="pl-4 pr-2 text-slate-400">
          <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
            <Search className="w-5 h-5" />
          </div>
        </div>

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
          placeholder="Search by block (e.g. 34), room (34-205), gate (Gate 1), or landmark..."
          className="w-full py-4 pr-10 text-slate-900 placeholder-slate-400 font-semibold text-sm sm:text-base bg-transparent outline-none"
        />

        {query ? (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(true);
            }}
            className="p-1.5 mr-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="hidden sm:flex items-center gap-1 mr-3 text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
            <span>Find Any Room</span>
          </div>
        )}
      </div>

      {/* Dropdown Suggestions & Results */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Category Filter Pills Bar */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mr-1">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              {[
                { id: 'all', label: 'All' },
                { id: 'block', label: 'Blocks' },
                { id: 'room', label: 'Rooms' },
                { id: 'gate', label: 'Gates' },
                { id: 'landmark', label: 'Landmarks' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeFilter === f.id
                      ? 'bg-navy-950 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {query && (
              <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                {searchResults.length} {searchResults.length === 1 ? 'match' : 'matches'}
              </span>
            )}
          </div>

          {/* Results List */}
          {searchResults.length > 0 ? (
            <div className="py-1 divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {!query && (
                <div className="px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-orange-600 bg-orange-50/60">
                  Recommended Campus Waypoints
                </div>
              )}
              {searchResults.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                const isFav = favorites.includes(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectDestination(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected ? 'bg-orange-50 text-orange-950' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl flex-shrink-0 ${
                        item.category === 'gate' ? 'bg-emerald-100 text-emerald-700' :
                        item.category === 'block' ? 'bg-orange-100 text-orange-700' :
                        item.category === 'room' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <span>{item.title}</span>
                          {item.raw?.isHeroBlock && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-orange-500 text-white">
                              Block 34 (Hero)
                            </span>
                          )}
                          {item.raw?.isExamHall && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-purple-200 text-purple-900">
                              Exam Center
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Secondary Action: Start from Here */}
                      <button
                        onClick={(e) => handleSelectStart(e, item)}
                        className="hidden sm:inline-flex px-2 py-1 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-600 text-[10px] font-bold rounded-lg transition-colors items-center gap-1"
                        title="Set as starting point"
                      >
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        Set Start
                      </button>

                      {/* Favorite Star */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onToggleFavorite) onToggleFavorite(item.id);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isFav ? 'text-amber-500 hover:text-amber-600' : 'text-slate-300 hover:text-slate-500'
                        }`}
                        title={isFav ? "Remove from Favorites" : "Save to Favorites"}
                      >
                        <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                      </button>

                      <div className="p-1.5 text-orange-600 hover:bg-orange-100 rounded-lg">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : query.trim() !== '' ? (
            /* No Results Found State */
            <div className="p-8 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-base mb-1">
                No location found for "{query}"
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                Try searching for <span className="font-bold text-orange-600">"34"</span>, <span className="font-bold text-orange-600">"Gate 1"</span>, <span className="font-bold text-orange-600">"34-205"</span>, or <span className="font-bold text-orange-600">"Library"</span>.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {['Block 34', 'Gate 1', 'Room 34-205', 'UniMall', 'Unipolis', 'Central Library'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1 text-xs rounded-full bg-slate-100 hover:bg-orange-100 hover:text-orange-700 text-slate-700 font-semibold transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Recent Searches Footer Strip */}
          {recentSearches && recentSearches.length > 0 && (
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Recent:
              </span>
              {recentSearches.slice(0, 4).map((term, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(term)}
                  className="px-2.5 py-0.5 bg-white hover:bg-orange-50 hover:text-orange-700 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
