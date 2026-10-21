import React, { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Star,
  Clock,
  MapPin,
  Navigation,
  Settings,
  RotateCcw,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  MessageSquare,
  Building2,
  DoorOpen,
  Layers,
  ArrowRight
} from 'lucide-react';
import { loadCommunityPosts } from '../data/communityData';

export default function ProfilePage({
  nodes = [],
  rooms = [],
  favorites = [],
  onRemoveFavorite,
  recentSearches = [],
  onClearRecentSearches,
  onResetToDefault,
  isHighContrast,
  onToggleHighContrast,
  isLargeText,
  onToggleLargeText,
}) {
  const navigate = useNavigate();
  const allPosts = loadCommunityPosts();
  const myPosts = useMemo(() => {
    return allPosts.filter(p => p.author.includes('You'));
  }, [allPosts]);

  // Resolve favorites
  const resolvedFavorites = useMemo(() => {
    return favorites.map(favId => {
      if (favId.startsWith('room-')) {
        const rId = favId.replace('room-', '');
        const room = rooms.find(r => r.id === rId);
        if (room) {
          return {
            id: favId,
            type: 'room',
            title: `Room ${room.roomNumber} (${room.name})`,
            subtitle: `Block ${room.blockNumber} • ${room.floorName}`,
            nodeId: room.blockId,
            roomObj: room,
          };
        }
      } else {
        const node = nodes.find(n => n.id === favId);
        if (node) {
          return {
            id: favId,
            type: node.category,
            title: node.name,
            subtitle: `${node.zone} (${node.code})`,
            nodeId: node.id,
            nodeObj: node,
          };
        }
      }
      return null;
    }).filter(Boolean);
  }, [favorites, nodes, rooms]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Header */}
      <div className="pb-6 border-b border-[#E8EAF2]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3F0FF] text-xs font-semibold text-[#635BFF] mb-2">
          <User className="w-3.5 h-3.5" />
          <span>Student Account</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
          My Profile & Settings
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] mt-1">
          Manage saved destinations, recent navigation history, community activity, and accessibility.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-[#E8EAF2] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#635BFF] to-[#8075FF] text-white font-bold text-xl flex items-center justify-center shadow-md">
            AS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#0F172A]">USER69</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F3F0FF] text-[#635BFF]">
                Verified Student
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Reg ID: 12104928 • B.Tech Computer Science & Engineering (Batch 2023–2027)
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-[#94A3B8]">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#635BFF]" /> Primary Hub: Block 34</span>
              <span>•</span>
              <span>Hostel: BH-4</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => navigate('/map?start=gate-1&dest=block-34')}
            className="px-4 py-2 bg-[#635BFF] hover:bg-[#5145E5] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Route to Block 34</span>
          </button>
        </div>
      </div>

      {/* Grid: Saved Places & Accessibility */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column (8 cols): Saved Places & History */}
        <div className="lg:col-span-8 space-y-6">

          {/* Saved Favorites Section */}
          <div className="bg-white rounded-3xl border border-[#E8EAF2] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <h3 className="font-bold text-base text-[#0F172A]">
                  Saved Favorite Destinations ({resolvedFavorites.length})
                </h3>
              </div>
              <Link to="/destinations" className="text-xs font-semibold text-[#635BFF] hover:underline">
                Explore All Destinations →
              </Link>
            </div>

            {resolvedFavorites.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {resolvedFavorites.map(fav => (
                  <div key={fav.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-[#F3F0FF] text-[#635BFF]">
                        {fav.type === 'room' ? <Layers className="w-4 h-4" /> : fav.type === 'gate' ? <DoorOpen className="w-4 h-4 text-emerald-600" /> : <Building2 className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0F172A]">{fav.title}</div>
                        <div className="text-[11px] text-[#64748B]">{fav.subtitle}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/map?dest=${fav.nodeId}`)}
                        className="px-3 py-1 bg-[#F3F0FF] hover:bg-[#635BFF] text-[#635BFF] hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Navigate</span>
                      </button>
                      <button
                        onClick={() => onRemoveFavorite && onRemoveFavorite(fav.id)}
                        className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-[#94A3B8]">
                No saved places yet. Star any block or room to bookmark it here.
              </div>
            )}
          </div>

          {/* Recent Searches Section */}
          <div className="bg-white rounded-3xl border border-[#E8EAF2] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#635BFF]" />
                <h3 className="font-bold text-base text-[#0F172A]">
                  Recent Searches
                </h3>
              </div>
              {recentSearches.length > 0 && (
                <button
                  onClick={onClearRecentSearches}
                  className="text-xs text-[#94A3B8] hover:text-rose-500 font-semibold"
                >
                  Clear History
                </button>
              )}
            </div>

            {recentSearches.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const matched = nodes.find(n => n.name.toLowerCase().includes(term.toLowerCase()));
                      if (matched) navigate(`/map?dest=${matched.id}`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-[#F3F0FF] border border-[#E8EAF2] text-xs font-semibold text-[#0F172A] hover:text-[#635BFF] transition-all flex items-center gap-1.5"
                  >
                    <span>{term}</span>
                    <ArrowRight className="w-3 h-3 text-[#94A3B8]" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-[#94A3B8]">
                No recent searches logged in this session.
              </div>
            )}
          </div>

          {/* My Community Activity */}
          <div className="bg-white rounded-3xl border border-[#E8EAF2] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#635BFF]" />
                <h3 className="font-bold text-base text-[#0F172A]">
                  My Community Posts ({myPosts.length})
                </h3>
              </div>
              <Link to="/community" className="text-xs font-semibold text-[#635BFF] hover:underline">
                New Post →
              </Link>
            </div>

            {myPosts.length > 0 ? (
              <div className="space-y-3">
                {myPosts.map(p => (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/community/${p.id}`)}
                    className="p-3.5 bg-slate-50 hover:bg-[#FAF9FF] rounded-2xl border border-slate-200 cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-[#635BFF]">
                          {p.category}
                        </span>
                        <span className="text-xs text-[#94A3B8]">{p.timestamp}</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#0F172A] mt-1">{p.title}</h4>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#94A3B8]" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-[#94A3B8]">
                You haven't published any community posts yet. Share tips or questions on the Campus Connect feed.
              </div>
            )}
          </div>

        </div>

        {/* Right Column (4 cols): Preferences & System Controls */}
        <div className="lg:col-span-4 space-y-6">

          {/* Accessibility Settings */}
          <div className="bg-white rounded-3xl border border-[#E8EAF2] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#635BFF]" />
              <h3 className="font-bold text-sm text-[#0F172A]">Accessibility & Display</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-[#E8EAF2]">
                <div>
                  <div className="font-bold text-[#0F172A]">Large Text Mode</div>
                  <div className="text-[11px] text-[#64748B]">Scale typography for readability</div>
                </div>
                <button
                  onClick={onToggleLargeText}
                  className={`w-11 h-6 rounded-full transition-colors relative ${isLargeText ? 'bg-[#635BFF]' : 'bg-slate-300'
                    }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${isLargeText ? 'left-5' : 'left-0.5'
                    }`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-[#E8EAF2]">
                <div>
                  <div className="font-bold text-[#0F172A]">High Contrast Mode</div>
                  <div className="text-[11px] text-[#64748B]">WCAG AAA high contrast outlines</div>
                </div>
                <button
                  onClick={onToggleHighContrast}
                  className={`w-11 h-6 rounded-full transition-colors relative ${isHighContrast ? 'bg-amber-400' : 'bg-slate-300'
                    }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${isHighContrast ? 'left-5' : 'left-0.5'
                    }`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Reset Local Prototype Data */}
          <div className="bg-[#FAF9FF] rounded-3xl border border-[#E0DBFF] p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#635BFF]">
              Prototype Reset
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Reset local storage nodes, edges, room catalogs, and favorites back to the pristine university baseline dataset.
            </p>
            <button
              onClick={onResetToDefault}
              className="w-full py-2 bg-white hover:bg-slate-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default Dataset</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
