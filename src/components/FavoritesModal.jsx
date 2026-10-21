import React from 'react';
import { Star, X, Building2, Layers, DoorOpen, ArrowRight } from 'lucide-react';

export default function FavoritesModal({
  isOpen,
  onClose,
  favorites = [],
  nodes = [],
  rooms = [],
  onSelectFavorite,
  onRemoveFavorite,
}) {
  if (!isOpen) return null;

  // Resolve favorite items
  const resolvedFavorites = favorites.map(favId => {
    if (favId.startsWith('room-')) {
      const rId = favId.replace('room-', '');
      const room = rooms.find(r => r.id === rId);
      if (room) {
        return {
          id: favId,
          type: 'room',
          title: `${room.roomNumber} — ${room.name}`,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E8EAF2] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E8EAF2] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#0F172A]">
                Saved Favorites
              </h3>
              <p className="text-xs text-[#64748B]">
                Quick access to bookmarked campus locations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#94A3B8] hover:text-[#0F172A] rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Favorites List */}
        <div className="p-4 max-h-96 overflow-y-auto divide-y divide-slate-100">
          {resolvedFavorites.length > 0 ? (
            resolvedFavorites.map(item => (
              <div
                key={item.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-xl transition-colors"
              >
                <div
                  onClick={() => {
                    onSelectFavorite(item);
                    onClose();
                  }}
                  className="flex-1 cursor-pointer flex items-center gap-3"
                >
                  <div className="p-2 rounded-xl bg-[#F3F0FF] text-[#635BFF]">
                    {item.type === 'room' ? (
                      <Layers className="w-4 h-4" />
                    ) : item.type === 'gate' ? (
                      <DoorOpen className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Building2 className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A]">{item.title}</h4>
                    <p className="text-[11px] text-[#64748B]">{item.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onRemoveFavorite(item.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg transition-colors"
                    title="Remove from favorites"
                  >
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </button>
                  <button
                    onClick={() => {
                      onSelectFavorite(item);
                      onClose();
                    }}
                    className="p-1.5 text-[#635BFF] hover:bg-[#F3F0FF] rounded-lg transition-colors"
                    title="Navigate"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-[#94A3B8]">
              <Star className="w-10 h-10 text-slate-200 mx-auto mb-2" />
              <p className="text-xs font-semibold text-[#0F172A]">No saved favorites yet</p>
              <p className="text-[11px] text-[#64748B] mt-1 max-w-xs mx-auto">
                Click the star icon in search results or location cards to bookmark frequently visited campus destinations.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-[#E8EAF2] text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
